import { supabase } from "./supabaseClient";

async function testConnection() {
  const { data, error } = await supabase.from("rsvp").select("*").limit(1);

  if (error) {
    console.error("Error al conectar con Supabase:", error.message);
  } else {
    console.log("Conexión exitosa con Supabase. Ejemplo de datos:", data);
  }
}

testConnection();
