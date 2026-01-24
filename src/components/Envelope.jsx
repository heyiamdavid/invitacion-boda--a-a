import { useState, useEffect } from "react";
import "../styles/envelope.css";

export default function Envelope({ onOpen, onStartMusic }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Preload critical images for immediate display
    const imagesToPreload = [
      "/assets/sobre/fondo_blanco.jpg",
      "/assets/sobre/sobrearriba.webp",
      "/assets/sobre/sobreabajo.webp",
      "/assets/images/sello.webp",
      "/assets/images/flor-dorada.webp",
      "/assets/images/flor-lado-dorada.webp"
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleOpen = () => {
    if (open) return;

    setOpen(true);
    if (onStartMusic) onStartMusic(); // 🔥 Iniciar música al click

    setTimeout(() => {
      if (onOpen) onOpen();
    }, 900);
  };

  return (
    <div id="sobre-container">
      <img
        src="/assets/images/flor-dorada.webp"
        className={`flor flor-izq ${open ? "abierto" : ""}`}
        alt="Flor izquierda"
      />
      <img
        src="/assets/images/flor-lado-dorada.webp"
        className={`flor flor-der ${open ? "abierto" : ""}`}
        alt="Flor derecha"
      />

      <div className={`sobre ${open ? "abierto" : ""}`} onClick={handleOpen}>
        <img
          src="/assets/sobre/sobreabajo.webp"
          className="abajo"
          alt="Triángulo abajo"
        />

        <img
          src="/assets/sobre/fondo_blanco.jpg"
          className="cuadrado"
          alt="Cuerpo del sobre"
        />

        <img
          src="/assets/sobre/sobrearriba.webp"
          className="arriba"
          alt="Triángulo arriba"
        />

        <img
          src="/assets/images/sello.webp"
          className="sello"
          alt="Sello"
        />
      </div>
    </div>
  );
}
