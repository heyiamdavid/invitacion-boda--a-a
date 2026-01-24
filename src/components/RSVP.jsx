import { useState } from "react";
import { supabase } from "../supabaseClient";
import QRDisplay from "./QRDisplay";

/* LISTA DE INVITADOS Y LÍMITE DE PASES */
const invitadosPermitidos = [
  { nombre: "María Fernanda Alvarado Merchán", max: 2 },
  { nombre: "David Isaac Alvarado Merchán", max: 1 },
  { nombre: "Carlos Armando Salazar Jaramillo", max: 3 },
  { nombre: "Josue Armando Salazar Merchán", max: 1 },
  { nombre: "Irma Aracely Merchán Zambrano", max: 1 },
];

/* NORMALIZAR TEXTO */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zñ\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* 🔍 OBTENER INVITADO */
function obtenerInvitado(nombreNormalizado) {
  return invitadosPermitidos.find(
    (inv) => normalizarTexto(inv.nombre) === nombreNormalizado
  );
}

export default function RSVP() {
  const [nombre, setNombre] = useState("");
  const [invitados, setInvitados] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rsvpStep, setRsvpStep] = useState("initial"); // initial | attending | notAttending | notAttendingThanks

  /* 🟢 ASISTIRÉ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      if (!nombre.trim()) {
        setMensaje("Por favor ingresa tus 2 nombres y 2 apellidos");
        return;
      }

      const nombreNormalizado = normalizarTexto(nombre);
      const partes = nombreNormalizado.split(" ");

      /* VALIDACIONES */
      if (partes.length < 3) { // Flexibilizamos un poco a 3 palabras mínimo por si acaso
        // O mantenemos estricto 4? El original decía !== 4. Mantengamos original mejor.
        if (partes.length !== 4) {
          setMensaje("Ingresa exactamente 2 nombres y 2 apellidos");
          return;
        }
      } else {
        if (partes.length !== 4) {
          setMensaje("Ingresa exactamente 2 nombres y 2 apellidos");
          return;
        }
      }

      const invitado = obtenerInvitado(nombreNormalizado);
      if (!invitado) {
        setMensaje("Tu nombre no se encuentra en la lista de invitados");
        return;
      }

      if (Number(invitados) > invitado.max) {
        setMensaje(`Solo tienes permitido ${invitado.max} pase(s)`);
        return;
      }

      /* 🔍 BUSCAR SI YA EXISTE */
      const { data: existente, error: errorBusqueda } = await supabase
        .from("rsvp")
        .select("*")
        .eq("nombre", nombreNormalizado)
        .maybeSingle();

      if (errorBusqueda) throw errorBusqueda;

      const BASE_URL = window.location.origin;

      if (existente) {
        // Si ya existe y tenía invitados > 0, mostramos QR
        if (existente.invitados > 0) {
          const qrText = existente.qr_code || `${BASE_URL}/confirmacion?id=${existente.id}`;
          setQrData({ value: qrText, nombre: existente.nombre });
          setMensaje("Ya te encuentras registrado");
        } else {
          // Si existía con 0 invitados (había dicho que no), le permitimos cambiar a sí?
          // Supongamos que sí, actualizamos.
          // Ojo: Si ya existe, el original solo mostraba QR. 
          // Aquí si quiere cambiar de NO a SI, deberíamos hacer update.
          // Para simplificar, si ya existe, asumimos update si el usuario está en el form de "Asistiré".

          // Vamos a actualizar si ya existe para permitir cambios de opinión
          const { error: updateError } = await supabase
            .from("rsvp")
            .update({
              invitados: Number(invitados),
              qr_code: null,
              asistira: true // ✅ Confirmado
            }) // Reset QR si cambia algo? Mejor generamos nuevo o actualizamos.
            .eq("id", existente.id);

          if (updateError) throw updateError;

          // Generar QR para este existing
          const qrText = `${BASE_URL}/confirmacion?id=${existente.id}`;
          await supabase.from("rsvp").update({ qr_code: qrText }).eq("id", existente.id);

          setQrData({ value: qrText, nombre: existente.nombre });
          setMensaje(`Registro actualizado. ${invitados} pase(s) confirmados.`);
        }
        return;
      }

      /* REGISTRO NUEVO */
      const { data, error } = await supabase
        .from("rsvp")
        .insert([{
          nombre: nombreNormalizado,
          invitados: Number(invitados),
          asistira: true // ✅ Confirmado
        }])
        .select()
        .single();

      if (error) throw error;

      const qrText = `${BASE_URL}/confirmacion?id=${data.id}`;
      await supabase.from("rsvp").update({ qr_code: qrText }).eq("id", data.id);

      setQrData({ value: qrText, nombre: nombreNormalizado });
      setMensaje(`Registro exitoso. ${invitados} pase(s) confirmados.`);
      setNombre("");
      setInvitados(1);

    } catch (err) {
      console.error(err);
      setMensaje("Error al registrar asistencia");
    } finally {
      setLoading(false);
    }
  };

  /* 🔴 NO ASISTIRÉ */
  const handleNotAttendingSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      if (!nombre.trim()) {
        setMensaje("Por favor ingresa tu nombre completo");
        return;
      }

      const nombreNormalizado = normalizarTexto(nombre);
      const partes = nombreNormalizado.split(" ");
      if (partes.length !== 4) {
        setMensaje("Ingresa exactamente 2 nombres y 2 apellidos");
        return;
      }

      // Validar si está en la lista aunque no vaya
      const invitado = obtenerInvitado(nombreNormalizado);
      if (!invitado) {
        setMensaje("Tu nombre no se encuentra en la lista de invitados");
        return;
      }

      /* BUSCAR O CREAR CON 0 INVITADOS */
      const { data: existente } = await supabase
        .from("rsvp")
        .select("id")
        .eq("nombre", nombreNormalizado)
        .maybeSingle();

      if (existente) {
        await supabase
          .from("rsvp")
          .update({
            invitados: 0,
            qr_code: null,
            asistira: false // ❌ No asistirá
          })
          .eq("id", existente.id);
      } else {
        await supabase
          .from("rsvp")
          .insert([{
            nombre: nombreNormalizado,
            invitados: 0,
            asistira: false // ❌ No asistirá
          }]);
      }

      setRsvpStep("notAttendingThanks");
      setNombre("");
      setMensaje("");

    } catch (err) {
      console.error(err);
      setMensaje("Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  /* GOOGLE CALENDAR */
  const addToCalendar = () => {
    const url = "https://www.google.com/calendar/render?action=TEMPLATE&text=Boda&dates=20260418T163000/20260418T230000&details=Celebración%20de%20boda";
    window.open(url, "_blank");
  };

  /* RESET */
  const handleReset = () => {
    setQrData(null);
    setRsvpStep("initial");
    setNombre("");
    setMensaje("");
    setInvitados(1);
  };

  return (
    <section id="confirmacion" className="section fade-in-section paper-bg">
      <div className="paper-flower-right"></div>

      {/* 1️⃣ VISTA QR (ÉXITO ASISTENCIA) */}
      {qrData ? (
        <div className="confirm-container">
          <h2 className="confirm-title">¡Gracias por confirmar!</h2>
          <p className="confirm-sub">Presenta este código el día del evento</p>
          <div className="qr-card">
            <QRDisplay value={qrData.value} />
            <p><strong>Nombre:</strong> {qrData.nombre}</p>
          </div>
          <div className="qr-actions">
            <button className="qr-btn" onClick={addToCalendar}>Añadir al calendario</button>
            <button className="qr-btn" onClick={handleReset}>Cerrar</button>
          </div>
        </div>
      ) : (
        <div className="rsvp-card">
          <h2 className="rsvp-title">Confirmar Asistencia</h2>

          {/* 2️⃣ PASO INICIAL: BOTONES */}
          {rsvpStep === "initial" && (
            <div className="rsvp-initial-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <p style={{ marginBottom: '20px', textAlign: 'center' }}>¿Nos acompañarás en este día especial?</p>
              <button className="rsvp-btn" onClick={() => setRsvpStep("attending")}>
                ¡Sí, asistiré!
              </button>
              <button className="rsvp-btn" style={{ background: '#8c8c8c' }} onClick={() => setRsvpStep("notAttending")}>
                No asistiré
              </button>
            </div>
          )}

          {/* 3️⃣ FORMULARIO SÍ ASISTIRÉ */}
          {rsvpStep === "attending" && (
            <>
              <form className="rsvp-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Ej: Juan Carlos Pérez López (2 Nombres 2 Apellidos)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={loading}
                  required
                />
                <select
                  value={invitados}
                  onChange={(e) => setInvitados(e.target.value)}
                  disabled={loading}
                >
                  {[1, 2, 3, 4].map((n) => {
                    const invitado = obtenerInvitado(normalizarTexto(nombre));
                    return (
                      <option key={n} value={n} disabled={invitado && n > invitado.max}>
                        {n} Pase{n > 1 ? "s" : ""}
                      </option>
                    );
                  })}
                </select>
                <button type="submit" className="rsvp-btn" disabled={loading}>
                  {loading ? "Procesando..." : "Confirmar asistencia"}
                </button>
                <button
                  type="button"
                  className="rsvp-btn"
                  onClick={() => setRsvpStep("initial")}
                  style={{ background: '#8c8c8c', marginTop: '10px' }}
                >
                  Volver
                </button>
              </form>
              {mensaje && <div className="rsvp-message">{mensaje}</div>}
            </>
          )}

          {/* 4️⃣ FORMULARIO NO ASISTIRÉ */}
          {rsvpStep === "notAttending" && (
            <>
              <p style={{ marginBottom: '15px', textAlign: 'center' }}>Lamentamos que no puedas acompañarnos.</p>
              <form className="rsvp-form" onSubmit={handleNotAttendingSubmit}>
                <input
                  type="text"
                  placeholder="Ingresa tu nombre completo (2 Nombres 2 Apellidos)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={loading}
                  required
                />
                <button type="submit" className="rsvp-btn" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar"}
                </button>
                <button
                  type="button"
                  className="rsvp-btn"
                  onClick={() => setRsvpStep("initial")}
                  style={{ background: '#8c8c8c', marginTop: '10px' }}
                >
                  Volver
                </button>
              </form>
              {mensaje && <div className="rsvp-message">{mensaje}</div>}
            </>
          )}

          {/* 5️⃣ MENSAJE FINAL NO ASISTIRÉ */}
          {rsvpStep === "notAttendingThanks" && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                Muchas gracias por avisarnos. <br />
                Si cambias de opinión, estaremos felices de recibirte.
              </p>
              <button
                className="rsvp-btn"
                onClick={() => { setRsvpStep("attending"); setMensaje(""); }}
              >
                ¡Cambie de opinión! Asistiré
              </button>
            </div>
          )}

        </div>
      )}
    </section>
  );
}
