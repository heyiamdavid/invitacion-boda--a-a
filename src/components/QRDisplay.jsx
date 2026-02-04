
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
export default function QRDisplay({ value, label, nombre, nombre1, nombre2 }) {
  const qrRef = useRef(null);

  const handleDownload = () => {
    const qrCanvas = qrRef.current?.querySelector("canvas");
    
    if (!qrCanvas) {
      console.error("No se encontró el canvas del QR");
      alert("Error al descargar el QR. Por favor intenta de nuevo.");
      return;
    }

    try {
      // 1. Crear un nuevo canvas para la imagen final
      const width = 600; // Ancho deseado para la imagen final
      const height = 1000; // Aumentamos más para dar espacio abajo y evitar cortes
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = width;
      finalCanvas.height = height;
      const ctx = finalCanvas.getContext("2d");

      if (!ctx) {
        console.error("No se pudo obtener el contexto 2D del canvas final.");
        alert("Error al descargar el QR. Por favor intenta de nuevo.");
        return;
      }

      // 2. Fondo blanco
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      // 4. Helper function for rounded rectangles
      const roundRect = (ctx, x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };
      
      // --- MARCO EXTERIOR (Simulando la tarjeta) ---
      const outerMargin = 15;
      ctx.strokeStyle = "#C5A059";
      ctx.lineWidth = 2; // Borde más fino para el exterior
      roundRect(ctx, outerMargin, outerMargin, width - outerMargin*2, height - outerMargin*2, 25);
      ctx.stroke();

      // --- TÍTULO ---
      ctx.textAlign = "center";
      ctx.fillStyle = "#333333";
      ctx.font = "40px 'Catchy Mager', cursive"; 
      ctx.fillText(label, width / 2, 90);

      // --- QR CODE ---
      const qrSize = 300; 
      const qrX = (width - qrSize) / 2;
      const qrY = 130;
      
      // Borde del QR
      ctx.strokeStyle = "#C5A059"; 
      ctx.lineWidth = 3;
      roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 20);
      ctx.stroke();

      // Imagen QR
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // --- NOMBRES ---
      ctx.textAlign = "left";
      ctx.fillStyle = "#2F2F2F";
      
      const fontRegular = "24px 'TTNorms', sans-serif";
      const fontBold = "600 24px 'TTNorms', sans-serif";
      
      // Ajustamos posición para centrar visualmente el bloque de texto si es posible, 
      // o usamos un margen izquierdo fijo consistente.
      const textStartX = 60; 
      let currentY = qrY + qrSize + 80; // Un poco más de aire después del QR

      // Nombre 1
      const n1 = nombre1 || nombre || "Invitado";
      ctx.font = fontBold;
      ctx.fillText("Primer pase: ", textStartX, currentY);
      
      const metrics1 = ctx.measureText("Primer pase: ");
      ctx.font = fontRegular;
      ctx.fillText(n1, textStartX + metrics1.width, currentY);
      
      // Nombre 2
      if (nombre2) {
          currentY += 45; // Un pelín más de espacio entre nombres
          ctx.font = fontBold;
          ctx.fillText("Segundo pase: ", textStartX, currentY);
          
          const metrics2 = ctx.measureText("Segundo pase: ");
          ctx.font = fontRegular;
          ctx.fillText(nombre2, textStartX + metrics2.width, currentY);
      }

      // --- FOOTER ---
      currentY += 120; // Más espacio antes del footer
      ctx.textAlign = "center";
      
      // "Gracias por confirmar tu asistencia"
      ctx.font = "26px 'Catchy Mager', cursive"; 
      ctx.fillStyle = "#2F2F2F";
      ctx.fillText("Gracias por confirmar tu asistencia", width / 2, currentY);

      // "Con amor"
      currentY += 80; // Espaciado generoso
      ctx.font = "40px 'Amsterdam Three', cursive"; 
      ctx.fillStyle = "#C5A059"; 
      ctx.fillText("Con amor", width / 2, currentY);

      // "Maria y Jhon" (Script)
      currentY += 90; 
      ctx.font = "55px 'Amsterdam Three', cursive"; // Reducido un poco para evitar cortes laterales
      ctx.fillStyle = "#C5A059";
      ctx.fillText("Maria y Jhon", width / 2, currentY);

      // Descargar la imagen
      const imgData = finalCanvas.toDataURL("image/png");
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

    
      </div>

      <button className="qr-download" onClick={handleDownload}>
        Descargar QR
      </button>
    </div>
  );
}
