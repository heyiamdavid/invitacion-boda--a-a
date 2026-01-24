import { useState, useEffect } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Evitar scroll cuando el menú está abierto
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    // Ocultar botón de música
    const musicBtn = document.querySelector(".music-btn");
    if (musicBtn) musicBtn.style.display = menuOpen ? "none" : "flex";

  }, [menuOpen]);

  const links = [
    { id: "inicio", label: "Nos Casamos" },
    { id: "cuando-donde", label: "Cuándo y Dónde" },
    { id: "minuto-minuto", label: "Programación y Horarios" },
    { id: "hospedaje", label: "Hospedaje" },
    { id: "galeria", label: "Galería" },
    { id: "confirmacion", label: "Confirmación" },
    { id: "dudas", label: "Dudas" },
  ];

  return (
    <>
      <header className="navbar visible">
        <div className="navbar-inner">

          {/* Brand */}
          <a href="#inicio" className="brand">
            <div className="brand-logo">
              <img src="/assets/images/logo_colores.webp" alt="Logo Maria y Jhon" />
            </div>
            <div className="brand-text">Nuestra Boda</div>
          </a>


          {/* Links desktop */}
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Botón Burger */}
          <div
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </header>

      {/* MENU MÓVIL */}
      <nav className={`mobile-menu ${menuOpen ? "show" : ""}`}>

        {/* Botón X para cerrar */}
        <button
          className="close-menu-btn"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
}
