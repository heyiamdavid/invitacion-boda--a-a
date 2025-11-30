import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/admin.css";
export default function AdminDashboard() {
  const [asistentes, setAsistentes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("rsvp").select("*");
    if (error) console.error(error);
    else setAsistentes(data);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-4">
        🎉 Lista de invitados confirmados
      </h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-pink-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Invitados</th>
            <th className="p-3 text-left">QR</th>
          </tr>
        </thead>
        <tbody>
          {asistentes.map((a) => (
            <tr key={a.id} className="border-t hover:bg-pink-50">
              <td className="p-3">{a.id}</td>
              <td className="p-3 capitalize">{a.nombre}</td>
              <td className="p-3">{a.invitados}</td>
              <td className="p-3">
                {a.qr_code ? (
                  <a
                    href={a.qr_code}
                    target="_blank"
                    className="text-pink-600 underline"
                  >
                    Ver QR
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
