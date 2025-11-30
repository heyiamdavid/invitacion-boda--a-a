import { useState } from "react";
import "../styles/envelope.css";

export default function Envelope({ onOpen }) {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const handleOpen = () => {
    if (open) return;

    setOpen(true);

    // después de la animación de zoom, ocultar el sobre y mostrar contenido
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 900); // debe coincidir con el tiempo del zoomReveal
  };

  return (
    <div id="sobre-container" className={hide ? "hidden" : ""}>
      <img src="/assets/images/flor-dorada.png" className="flor flor-izq" alt="Flor izquierda" />
      <img src="/assets/images/flor-lado-dorada.png" className="flor flor-der" alt="Flor derecha" />

      <div className={`sobre ${open ? "abierto" : ""}`} onClick={handleOpen}>
        <img src="/assets/sobre/mw-env-middle-layer.png" className="cuadrado" alt="Cuadrado" />
        <img src="/assets/sobre/mw-env-bottom-layer.png" className="abajo" alt="Triángulo abajo" />
        <img src="/assets/sobre/mw-env-top-layer.png" className="arriba" alt="Triángulo arriba" />
        <img src="/assets/images/sello.png" className="sello" alt="Sello" />
      </div>
    </div>
  );
}
