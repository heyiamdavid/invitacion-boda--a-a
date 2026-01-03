import { useState } from "react";
import "../styles/envelope.css";

export default function Envelope({ onOpen }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (open) return;

    setOpen(true);

    setTimeout(() => {
      if (onOpen) onOpen();
    }, 900);
  };

  return (
    <div id="sobre-container">
      <img
        src="/assets/images/flor-dorada.webp"
        className="flor flor-izq"
        alt="Flor izquierda"
      />
      <img
        src="/assets/images/flor-lado-dorada.webp"
        className="flor flor-der"
        alt="Flor derecha"
      />

      <div className={`sobre ${open ? "abierto" : ""}`} onClick={handleOpen}>
        <img
          src="/assets/sobre/mw-env-bottom-layer.png"
          className="abajo"
          alt="Triángulo abajo"
        />

        <img
          src="/assets/sobre/mw-env-middle-layer.png"
          className="cuadrado"
          alt="Cuerpo del sobre"
        />

        <img
          src="/assets/sobre/mw-env-top-layer.png"
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
