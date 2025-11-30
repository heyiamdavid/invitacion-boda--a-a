import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
export default function QRDisplay({ value, label, nombre }) {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    
    if (!canvas) {
      console.error("No se encontró el canvas del QR");
      alert("Error al descargar el QR. Por favor intenta de nuevo.");
      return;
    }

    try {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `QR_${nombre || "invitado"}.png`;
      link.click();
    } catch (error) {
      console.error("Error al descargar QR:", error);
      alert("Error al descargar el QR. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className="qr-wrapper">
      <p className="qr-label">{label}</p>

      <div ref={qrRef} className="qr-box">
        <QRCodeCanvas 
          value={value}
          size={200}
          includeMargin={true}
          level="H"
        />

        <p className="qr-name">Nombre: {nombre}</p>
      </div>

      <button className="qr-download" onClick={handleDownload}>
        Descargar QR
      </button>
    </div>
  );
}
