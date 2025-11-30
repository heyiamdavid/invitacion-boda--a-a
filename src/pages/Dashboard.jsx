import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Dashboard() {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitados();

    const channel = supabase
      .channel("rsvp_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvp" },
        (payload) => {
          console.log("Cambio detectado:", payload);
          fetchInvitados(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInvitados = async () => {
    const { data, error } = await supabase
      .from("rsvp")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("Error cargando invitados:", error.message);
    else setInvitados(data || []);

    setLoading(false);
  };

  const marcarAsistencia = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    await supabase.from("rsvp").update({ asistio: nuevoEstado }).eq("id", id);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          Panel de Invitados
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Cargando datos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-pink-200 text-pink-900 text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Invitados</th>
                  <th className="p-3">QR</th>
                  <th className="p-3">Asistencia</th>
                  <th className="p-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {invitados.length > 0 ? (
                  invitados.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b hover:bg-pink-50 transition-colors"
                    >
                      <td className="p-3 text-gray-700">{inv.id}</td>
                      <td className="p-3 capitalize">{inv.nombre}</td>
                      <td className="p-3">{inv.invitados}</td>
                      <td className="p-3 text-blue-600">
                        {inv.qr_code ? (
                          <a
                            href={inv.qr_code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800"
                          >
                            Ver QR
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        {inv.asistio ? (
                          <span className="text-green-600 font-semibold">
                            Asistió
                          </span>
                        ) : (
                          <span className="text-gray-500 font-medium">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => marcarAsistencia(inv.id, inv.asistio)}
                          className={`px-4 py-1 rounded-lg font-semibold text-white ${
                            inv.asistio
                              ? "bg-gray-500 hover:bg-gray-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {inv.asistio ? "Desmarcar" : "Marcar"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-gray-500 py-6 italic"
                    >
                      No hay invitados registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
