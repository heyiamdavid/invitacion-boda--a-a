export default function Hero() {
  return (
    <section id="inicio" className="hero fade-in-section">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        {/* Logo del monograma M & J */}
        <div className="hero-logo">
          <img 
            src="/assets/images/logo_colores.png" 
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
      </div>
    </section>
  );
}