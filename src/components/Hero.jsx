export default function Hero() {
  return (
    <section id="inicio" className="hero fade-in-section">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        {/* Texto superior */}
        <h2 className="hero-top-text">¡Nos Casamos!</h2>

        {/* Logo del monograma M & J */}
        <div className="hero-logo">
          <img
            src="/assets/images/logo_colores.webp"
            alt="Maria y Jhon - Monograma"
          />
        </div>

        {/* Nombres en tipografía script elegante */}
        <h1 className="hero-title">Maria y Jhon</h1>

        {/* Fecha oculta con CSS */}
        <p className="hero-date">18 · Abril · 2026</p>

        {/* Botón de confirmación centrado */}
        <a href="#confirmacion" className="hero-button">
          Confirmar Asistencia
        </a>
        <h1 className="hero-title-2">
          <span className="line-1">Ambos diremos</span>
          <span className="line-2">"Acepto"</span>
        </h1>

      </div>
    </section>
  );
}