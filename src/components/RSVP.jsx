import { useState } from "react";
import { supabase } from "../supabaseClient";
import QRDisplay from "./QRDisplay";
export default function RSVP() {
  const [nombre, setNombre] = useState("");
  const [invitados, setInvitados] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zñ\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      if (!nombre.trim()) {
        setMensaje("Por favor ingresa un nombre");
        setLoading(false);
        return;
      }

      const nombreNormalizado = normalizarTexto(nombre);

      const { data, error } = await supabase
        .from("rsvp")
        .insert([{ nombre: nombreNormalizado, invitados: Number(invitados) }])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No se recibió data del registro");

      const registro = data[0];

      const BASE_URL = window.location.origin;
      const qrText = `${BASE_URL}/confirmacion?id=${registro.id}`;

      await supabase
        .from("rsvp")
        .update({ qr_code: qrText })
        .eq("id", registro.id);

      setQrData({
        value: qrText,
        nombre: nombreNormalizado,
      });

      setMensaje(`¡Gracias ${nombreNormalizado}! Registramos ${invitados} invitado(s).`);
      setNombre("");
      setInvitados(1);

    } catch (err) {
      let mensajeError = "Error registrando asistencia. ";
      if (err.message) mensajeError += err.message;
      if (err.hint) mensajeError += ` Pista: ${err.hint}`;
      setMensaje(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE CALENDAR
  const addToCalendar = () => {
    const url =
      `https://www.google.com/calendar/render?action=TEMPLATE&text=Boda&dates=20250614T170000/20250614T230000&details=Celebración%20de%20boda&location=Zamora%2C%20Michoacán`;

    window.open(url, "_blank");
  };

  // ✅ DESCARGAR QR
  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-confirmacion.png";
    link.click();
  };

  return (
    <section id="confirmacion" className="section fade-in-section">

      {!qrData && (
        <div className="rsvp-card">
          <h2 className="rsvp-title">Confirmar Asistencia</h2>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
            />

            <select
              value={invitados}
              onChange={(e) => setInvitados(e.target.value)}
              disabled={loading}
            >
              <option value="1">1 Pase</option>
              <option value="2">2 Pases</option>
              <option value="3">3 Pases</option>
              <option value="4">4 Pases</option>
            </select>

            <textarea
              placeholder="Mensaje para los novios (opcional)"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              disabled={loading}
            ></textarea>

            <button type="submit" className="rsvp-btn" disabled={loading}>
              {loading ? "Registrando..." : "Confirmar asistencia"}
            </button>
          </form>

          {mensaje && (
            <div className={`rsvp-message ${mensaje.includes("Error") ? "error" : "success"}`}>
              {mensaje}
            </div>
          )}
        </div>
      )}

      {/* ✅ SECCIÓN PREMIUM QR */}
      {qrData && (
        <div className="confirm-container">
          <h2 className="confirm-title">¡Gracias por confirmar!</h2>
          <p className="confirm-sub">Presenta este código el día del evento</p>

          <div className="qr-card">
            <QRDisplay value={qrData.value} />

            <p style={{ marginTop: "10px", fontWeight: "bold", color: "var(--color-primary)" }}>
              Nombre: {qrData.nombre}
            </p>
          </div>

          <div className="qr-actions">
            <button className="qr-btn" onClick={addToCalendar}>Añadir al Calendario</button>
            <button className="qr-btn" onClick={() => setQrData(null)}>Cerrar</button>
          </div>
        </div>
      )}

    </section>
  );
}
