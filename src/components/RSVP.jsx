import { useState } from "react";
import { supabase } from "../supabaseClient";
import QRDisplay from "./QRDisplay";

/* 🔐 LISTA DE INVITADOS Y LÍMITE DE PASES */
const invitadosPermitidos = [
  { nombre: "María Fernanda Alvarado Merchán", max: 2 },
  { nombre: "David Isaac Alvarado Merchán", max: 1 },
  { nombre: "Carlos Armando Salazar Jaramillo", max: 3 },
  { nombre: "Josue Armando Salazar Merchán", max: 1 },
  { nombre: "Irma Aracely Merchán Zambrano", max: 1 },
];

/* 🔎 NORMALIZAR TEXTO */
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      if (!nombre.trim()) {
        setMensaje("Por favor ingresa rus dos nombres y tus dos apellidos");
        return;
      }

      const nombreNormalizado = normalizarTexto(nombre);

      /* 🛑 VALIDAR 2 NOMBRES + 2 APELLIDOS */
      const partes = nombreNormalizado.split(" ");
      if (partes.length !== 4) {
        setMensaje("Ingresa exactamente 2 nombres y 2 apellidos");
        return;
      }

      /* 🔐 VALIDAR INVITADO */
      const invitado = obtenerInvitado(nombreNormalizado);
      if (!invitado) {
        setMensaje("Tu nombre no se encuentra en la lista de invitados");
        return;
      }

      /* 🎟️ VALIDAR LÍMITE DE PASES */
      if (Number(invitados) > invitado.max) {
        setMensaje(`Solo tienes permitido ${invitado.max} pase(s)`);
        return;
      }

      /* 🔎 VERIFICAR SI YA ESTÁ REGISTRADO */
      const { data: existente, error: errorBusqueda } = await supabase
        .from("rsvp")
        .select("*")
        .eq("nombre", nombreNormalizado)
        .maybeSingle();

      if (errorBusqueda) throw errorBusqueda;

      const BASE_URL = window.location.origin;

      /* 🔵 YA REGISTRADO */
      if (existente) {
        const qrText =
          existente.qr_code ||
          `${BASE_URL}/confirmacion?id=${existente.id}`;

        setQrData({
          value: qrText,
          nombre: existente.nombre,
        });

        setMensaje("Ya te encuentras registrado");
        return;
      }

      /* 🟢 REGISTRO NUEVO */
      const { data, error } = await supabase
        .from("rsvp")
        .insert([
          {
            nombre: nombreNormalizado,
            invitados: Number(invitados),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const qrText = `${BASE_URL}/confirmacion?id=${data.id}`;

      await supabase
        .from("rsvp")
        .update({ qr_code: qrText })
        .eq("id", data.id);

      setQrData({
        value: qrText,
        nombre: nombreNormalizado,
      });

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

  /* 📅 GOOGLE CALENDAR */
  const addToCalendar = () => {
    const url =
      "https://www.google.com/calendar/render?action=TEMPLATE&text=Boda&dates=20260418T163000/20260418T230000&details=Celebración%20de%20boda";
    window.open(url, "_blank");
  };

  return (
    <section
      id="confirmacion"
      className="section fade-in-section paper-bg"
    >
      {/* 🌸 FLOR DECORATIVA */}
      <div className="paper-flower-right"></div>

      {!qrData && (
        <div className="rsvp-card">
          <h2 className="rsvp-title">Confirmar Asistencia</h2>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ej: Juan Carlos Pérez López"
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
                const invitado = obtenerInvitado(
                  normalizarTexto(nombre)
                );
                return (
                  <option
                    key={n}
                    value={n}
                    disabled={invitado && n > invitado.max}
                  >
                    {n} Pase{n > 1 ? "s" : ""}
                  </option>
                );
              })}
            </select>

            <button
              type="submit"
              className="rsvp-btn"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar asistencia"}
            </button>
          </form>

          {mensaje && (
            <div className="rsvp-message">{mensaje}</div>
          )}
        </div>
      )}

      {qrData && (
        <div className="confirm-container">
          <h2 className="confirm-title">¡Gracias por confirmar!</h2>
          <p className="confirm-sub">
            Presenta este código el día del evento
          </p>

          <div className="qr-card">
            <QRDisplay value={qrData.value} />
            <p>
              <strong>Nombre:</strong> {qrData.nombre}
            </p>
          </div>

          <div className="qr-actions">
            <button className="qr-btn" onClick={addToCalendar}>
              Añadir al calendario
            </button>
            <button
              className="qr-btn"
              onClick={() => setQrData(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
