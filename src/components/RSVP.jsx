import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import QRDisplay from "./QRDisplay";

/* LISTA DE INVITADOS Y LÍMITE DE PASES */
const invitadosPermitidos = [
  { nombre: "Olger Victor Ríos", max: 1 },
  { nombre: "María Del Carmen Pacheco Pacheco", max: 1 },
  { nombre: "Javier Alexander Ríos Pacheco", max: 2, acompanante: "Diana Contreras Villacís" },
  { nombre: "Jairo Fabian Saltos Castro", max: 2, acompanante: "Jeannethe Gisella Ríos Pacheco" },
  { nombre: "Juan Carlos Camposano Macías", max: 1 },
  { nombre: "Kaira Antonella Mendoza Zambrano", max: 1 },
  { nombre: "Ronald Joel García Arcos", max: 1 },
  { nombre: "Christian David Alvarado Valarezo", max: 2 },
  { nombre: "Kleber Mauricio Arreaga Borja", max: 1 },
  { nombre: "Jaime Josué Montenegro Núñez", max: 2 },
  { nombre: "Raúl Espedito Ríos", max: 2 },
  { nombre: "Fernando Miguel Basantes Molina", max: 2 },
  { nombre: "Elsa Luz Pacheco Pacheco", max: 1 },
  { nombre: "Lucio Antonio Pacheco Pacheco", max: 1 },
  { nombre: "Carlos Manuel Pacheco Pacheco", max: 2 },
  { nombre: "Robert Douglas Quito Martínez", max: 2 },
  { nombre: "George Hendrik Baque Parrales", max: 1 },
  { nombre: "Lizardo William Merchán Zambrano", max: 1 },
  { nombre: "Irma Aracely Merchán Zambrano", max: 1 },
  { nombre: "Carlos Armando Salazar Jaramillo", max: 1 },
  { nombre: "Josué Armando Salazar Merchán", max: 1 },
  { nombre: "David Isaac Alvarado Merchán", max: 2 },
  { nombre: "Olga Dolores Merchán Zambrano", max: 2 },
  { nombre: "Natacha Coromoto Holguín Rangel", max: 2 },
  { nombre: "Adriana Elizabeth Castillo Vallejo", max: 1 },
  { nombre: "Solange Margarita Chávez Delgado", max: 2 },
  { nombre: "Jenniffer Cristina Galarza López", max: 1 },
  { nombre: "Gissell Stefania Bonilla Maquilón", max: 2 },
  { nombre: "Pamela Priscila Parrales Pincay", max: 2 },
  { nombre: "Gema María Delgado Chávez", max: 2 },
  { nombre: "Santa Trinidad Zambrano Solórzano", max: 1 },
  { nombre: "Karla Mariela Macías Burgos", max: 2 },
  { nombre: "Cristina Mariana Párraga Roca", max: 2 },
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

/* 🔡 CAPITALIZAR (Title Case) */
function toTitleCase(str) {
  if (!str) return "";
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export default function RSVP({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [nombreAcompanante, setNombreAcompanante] = useState("");
  const [invitados, setInvitados] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rsvpStep, setRsvpStep] = useState("initial"); // initial | attending | notAttending | notAttendingThanks

  // 🔄 RESTORE SESSION FROM LOCAL STORAGE
  useEffect(() => {
    const validateSession = async () => {
      const storedId = localStorage.getItem("boda_guest_id");
      const storedName = localStorage.getItem("boda_guest_name");

      if (!storedId || !storedName) return;

      console.log("RSVP: Validating session...", { storedId, storedName });

      try {
        // Verificar si el ID existe en la base de datos
        const { data, error } = await supabase
          .from("rsvp")
          .select("id, qr_code")
          .eq("id", storedId)
          .maybeSingle();

        if (error || !data) {
          console.warn("RSVP: Stale session detected, clearing localStorage");
          localStorage.removeItem("boda_guest_id");
          localStorage.removeItem("boda_guest_name");
          if (onLogin) onLogin(null, null);
          return;
        }

        console.log("RSVP: Session is valid");
        if (onLogin) onLogin(storedId, storedName);
        const BASE_URL = window.location.origin;
        const n2 = data.qr_code && data.qr_code.includes('&n2=') ? decodeURIComponent(data.qr_code.split('&n2=')[1]) : "";
        const qrText = `${BASE_URL}/confirmacion?id=${storedId}${n2 ? '&n2='+encodeURIComponent(n2) : ''}`;
        
        const nombre1 = toTitleCase(storedName);
        const nombre2 = n2 ? toTitleCase(n2) : null;
        
        // Pass complete string for file name, but keep individual names for UI
        const nombreDisplay = nombre2 ? `${nombre1} y ${nombre2}` : nombre1;

        setQrData({ value: data.qr_code || qrText, nombre: nombreDisplay, nombre1, nombre2 });
      } catch (err) {
        console.error("RSVP: Error validating session", err);
      }
    };

    validateSession();
  }, [onLogin]);

  // Effect to auto-fill companion name if defined in guest list
  useEffect(() => {
    if (nombre.length > 5) {
      const invitado = obtenerInvitado(normalizarTexto(nombre));
      if (invitado && invitado.acompanante && parseInt(invitados) === 2) {
        setNombreAcompanante(invitado.acompanante);
      }
    }
  }, [nombre, invitados]);

  /* 🟢 ASISTIRÉ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("RSVP: handleSubmit");
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
      /* VALIDACIONES */
      if (partes.length < 3) { 
        setMensaje("Por favor ingresa tu nombre completo (mínimo 3 palabras)");
        return;
      }
      
      // Eliminamos la restricción estricta de 4 palabras para permitir casos de 3 o 5+ palabras
      // if (partes.length !== 4) { ... }

      const invitado = obtenerInvitado(nombreNormalizado);
      if (!invitado) {
        setMensaje("Tu nombre no se encuentra en la lista de invitados");
        return;
      }

      if (Number(invitados) > invitado.max) {
        setMensaje(`Solo tienes permitido ${invitado.max} pase(s)`);
        return;
      }

      // If pre-defined companion exists, force it? Or just ensure it's used?
      // User said: "valida que si el nombre del acompañante ya esta dentro del segundo pase sea ese el que se vaya a ingresar"
      if (invitado.acompanante && Number(invitados) === 2) {
         if (normalizarTexto(nombreAcompanante) !== normalizarTexto(invitado.acompanante)) {
             // If user tried to change it, maybe we warn or just correct it?
             // Let's correct it silently or warn. The effect should have filled it.
             // But if they customized it, we might want to respect the predefined one per user request.
             // We'll enforce the predefined one.
         }
      }

      /* 🔍 BUSCAR SI YA EXISTE */
      const { data: existente, error: errorBusqueda } = await supabase
        .from("rsvp")
        .select("*")
        .eq("nombre", nombreNormalizado)
        .maybeSingle();

      if (errorBusqueda) throw errorBusqueda;

      const BASE_URL = window.location.origin;
      // Determine final companion name
      const finalCompanionName = (Number(invitados) === 2) 
          ? (invitado.acompanante || nombreAcompanante) 
          : "";

      if (existente) {
        // Siempre actualizamos para permitir cambios (ej. agregar acompañante)
        console.log("RSVP: Updating existing registration");
        
        const { error: updateError } = await supabase
          .from("rsvp")
          .update({
            invitados: Number(invitados),
            qr_code: null, // Temporary reset
            asistira: true // ✅ Confirmado
          })
          .eq("id", existente.id);

        if (updateError) throw updateError;

        // Generar QR nuevo con el acompañante actualizado
        const qrText = `${BASE_URL}/confirmacion?id=${existente.id}&n2=${encodeURIComponent(finalCompanionName)}`;
        await supabase.from("rsvp").update({ qr_code: qrText }).eq("id", existente.id);

        // 💾 Save to localStorage
        if (onLogin) onLogin(existente.id, existente.nombre);

        const nombreCapitalizado = toTitleCase(nombreNormalizado);
        const nombreAcompananteCapitalizado = toTitleCase(finalCompanionName);
        
        const nombreDisplay = nombreAcompananteCapitalizado 
          ? `${nombreCapitalizado} y ${nombreAcompananteCapitalizado}` 
          : nombreCapitalizado;

        setQrData({ 
            value: qrText, 
            nombre: nombreDisplay, 
            nombre1: nombreCapitalizado, 
            nombre2: nombreAcompananteCapitalizado 
        });
        
        setMensaje(`Registro actualizado. ${invitados} pase(s) confirmados.`);
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

      const qrText = `${BASE_URL}/confirmacion?id=${data.id}&n2=${encodeURIComponent(finalCompanionName)}`;
      await supabase.from("rsvp").update({ qr_code: qrText }).eq("id", data.id);

      // 💾 Save to localStorage for photo upload
      if (onLogin) onLogin(data.id, nombreNormalizado);

      const nombreCapitalizado = toTitleCase(nombreNormalizado);
      const nombreAcompananteCapitalizado = toTitleCase(finalCompanionName);
       const nombreDisplay = nombreAcompananteCapitalizado 
        ? `${nombreCapitalizado} y ${nombreAcompananteCapitalizado}` 
        : nombreCapitalizado;

      setQrData({ value: qrText, nombre: nombreDisplay, nombre1: nombreCapitalizado, nombre2: nombreAcompananteCapitalizado });
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
            <QRDisplay 
              value={qrData.value} 
              label="Tu código de acceso" 
              nombre={qrData.nombre}
              nombre1={qrData.nombre1}
              nombre2={qrData.nombre2}
            />

            <div style={{ marginTop: '15px', textAlign: 'left', width: '100%' }}>
                <p style={{ marginBottom: '5px', fontSize: '1.1rem' }}>
                    <strong>Primer pase:</strong> {qrData.nombre1}
                </p>
                {qrData.nombre2 && (
                    <p style={{ marginBottom: '5px', fontSize: '1.1rem' }}>
                        <strong>Segundo pase:</strong> {qrData.nombre2}
                    </p>
                )}
            </div>
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
                  placeholder="Ej: Juan Carlos Pérez López (Nombre Completo)"
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
                
                {parseInt(invitados) > 1 && (
                   <div style={{ marginTop: '15px' }}>
                     <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>
                       Nombre del Acompañante:
                     </label>
                     <input
                       type="text"
                       placeholder="Nombre de tu acompañante"
                       value={nombreAcompanante}
                       onChange={(e) => setNombreAcompanante(e.target.value)}
                       disabled={loading || (obtenerInvitado(normalizarTexto(nombre))?.acompanante && true)}
                       style={{ 
                           marginTop: '0', 
                           background: (obtenerInvitado(normalizarTexto(nombre))?.acompanante) ? '#f0f0f0' : 'white' 
                       }}
                     />
                     {obtenerInvitado(normalizarTexto(nombre))?.acompanante && (
                         <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
                             * Acompañante preasignado
                         </small>
                     )}
                   </div>
                )}
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
                  placeholder="Ingresa tu nombre completo"
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
