import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import QRScanner from "../components/QRScanner";

export default function DashboardPage() {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitados();

    const channel = supabase
      .channel("rsvp_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvp" },
        () => {
          fetchInvitados();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInvitados = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rsvp")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error cargando invitados:", error.message);
      setInvitados([]);
    } else {
      setInvitados(data || []);
    }
    setLoading(false);
  };

  const marcarAsistencia = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    const { error } = await supabase
      .from("rsvp")
      .update({ asistio: nuevoEstado })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar asistencia:", error.message);
      return;
    }

    setInvitados((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, asistio: nuevoEstado } : inv
      )
    );
  };

  const total = invitados.length;
  const confirmados = invitados.filter((i) => !!i.qr_code).length;
  const asistentes = invitados.filter((i) => i.asistio).length;

  return (
    <section className="admin-container">
      {/* RESUMEN */}
      <div className="admin-summary">
        <div className="admin-card">
          <p>Total registros</p>
          <span>{total}</span>
        </div>

        <div className="admin-card">
          <p>Con QR generado</p>
          <span>{confirmados}</span>
        </div>

        <div className="admin-card">
          <p>Asistencias marcadas</p>
          <span>{asistentes}</span>
        </div>
      </div>

      {/* TABLA + SCANNER */}
      <div className="admin-grid">
        {/* TABLA */}
        <div className="admin-table-container">
          <h2>📋 Panel de invitados</h2>

          {loading ? (
            <p className="text-center">Cargando datos...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Invitados</th>
                  <th>QR</th>
                  <th>Asistencia</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {invitados.length > 0 ? (
                  invitados.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.id}</td>
                      <td className="capitalize">{inv.nombre}</td>
                      <td>{inv.invitados}</td>
                      <td>
                        {inv.qr_code ? (
                          <a
                            href={inv.qr_code}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver QR
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {inv.asistio ? "✅ Asistió" : "❌ Pendiente"}
                      </td>
                      <td>
                        <button
                          className="btn-green"
                          onClick={() =>
                            marcarAsistencia(inv.id, inv.asistio)
                          }
                        >
                          {inv.asistio ? "Desmarcar" : "Marcar"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No hay invitados registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* SCANNER */}
        <div className="admin-scanner">
          <h2>📷 Escáner de asistencia</h2>
          <p>Escanea el QR del invitado para registrar asistencia.</p>

          <QRScanner />
        </div>
      </div>
    </section>
  );
}
