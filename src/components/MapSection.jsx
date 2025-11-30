export default function MapSection() {
  return (
    <section className="section fade-in-section" style={{ background: "#f0ede7" }}>
      <div className="section-content">
        <h2 className="section-title">Ubicación</h2>
        <div className="map-wrapper">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.5!2d-101.0!3d20.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDAwJzAwLjAiTiAxMDHCsDAwJzAwLjAiVw!5e0!3m2!1sen!2smx!4v1234567890"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
