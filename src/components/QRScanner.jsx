import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import jsQR from "jsqr";
export default function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanQR();
      } catch (error) {
        setMensaje("No se pudo acceder a la cámara");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const scanQR = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(loop);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, canvas.width, canvas.height);

      if (code?.data) {
        procesarQR(code.data);
        return; // detener
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  const procesarQR = async (texto) => {
    setMensaje("Leyendo QR...");

    // extraer ID
    const match = texto.match(/id=(\d+)/);
    if (!match) {
      setMensaje("QR inválido");
      return;
    }

    const id = match[1];

    // actualizar supabase
    const { error } = await supabase
      .from("rsvp")
      .update({ asistio: true })
      .eq("id", id);

    if (error) {
      setMensaje("Error registrando asistencia");
      return;
    }

    setMensaje(`✅ Asistencia registrada (ID: ${id})`);

    // volver a escanear luego de 2s
    setTimeout(() => {
      setMensaje("");
      scanQR();
    }, 2000);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "90%", maxWidth: "400px", borderRadius: "10px" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {mensaje && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>{mensaje}</p>
      )}
    </div>
  );
}
