import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Confirmacion() {
  const [params] = useSearchParams();
  const [invitado, setInvitado] = useState(null);
  const [error, setError] = useState(null);
  const id = params.get("id");

  useEffect(() => {
    if (id) verificarInvitado();
  }, [id]);

  const verificarInvitado = async () => {
    try {
      const { data, error } = await supabase
        .from("rsvp")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("No se encontró el registro del invitado.");
        return;
      }

      setInvitado(data);

      if (!data.asistio) {
        await supabase.from("rsvp").update({ asistio: true }).eq("id", id);
      }
    } catch (err) {
      console.error(err);
      setError("Error al verificar la asistencia.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : invitado ? (
          <>
            <h2 className="text-3xl font-bold text-pink-700 mb-4">
              Asistencia Confirmada
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Nombre:</strong> <span style={{textTransform: 'capitalize'}}>{invitado.nombre}</span> {params.get("n2") ? `y ${params.get("n2")}` : ""}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Invitados:</strong> {invitado.invitados}
            </p>
            <p className="text-green-600 font-semibold mt-4">
              Tu asistencia ha sido registrada correctamente.
            </p>
          </>
        ) : (
          <p className="text-gray-600">Cargando información...</p>
        )}
      </div>
    </section>
  );
}
