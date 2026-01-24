export default function Timeline() {
  const steps = [
    {
      title: "Ceremonia",
      time: "4:30 PM – 5:30 PM",
      desc: "Ambos diremos acepto frente al mar.",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M32 6v8" />
          <path d="M26 10h12" />
          <path d="M12 58V34l20-14 20 14v24H12z" />
          <path d="M26 58V44a6 6 0 0 1 12 0v14H26z" />
          <path d="M20 38v-4" />
          <path d="M44 38v-4" />
        </svg>
      )
    },
    {
      title: "Recepción",
      time: "5:30 PM – 10:00 PM",
      desc: "Disfrutemos juntos de una maravillosa celebración.",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="28" cy="32" r="14" />
          <circle cx="28" cy="32" r="8" />
          <path d="M46 16v32M52 16v32M49 16v32" />
        </svg>
      )
    },
    {
      title: "Fiesta",
      time: "10:00 PM – 11:00 PM",
      desc: "¡Disfruten la música en vivo!",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M40 10v28.5a6.5 6.5 0 1 1-2-4.6V16l-14 4v18.5a6.5 6.5 0 1 1-2-4.6V18l18-6z" />
        </svg>
      )
    }
  ];

  return (
    <section className="section fade-in-section paper-bg-clean" id="minuto-minuto">
      <div className="timeline-wrapper">
        <h2 className="timeline-title">Programación y Horarios</h2>
        <p style={{ textAlign: "center", marginBottom: "30px", padding: "0 20px" }}>
          Recuerda organizarte con tiempo para que no te pierdas ningún momento de esta ceremonia tan especial para nosotros.
        </p>
        <div className="timeline-grid">
          {steps.map((step, i) => (
            <div
              className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`}
              key={i}
            >
              <div className="timeline-heart"></div>

              <div className="timeline-icon">{step.icon}</div>

              <div className="timeline-block-inner">
                <div className="timeline-heading">{step.title}</div>
                <div className="timeline-hour">{step.time}</div>
                <div className="timeline-desc">{step.desc}</div>
              </div>
            </div>
          ))}

          <div className="timeline-separator"></div>
        </div>
      </div>
    </section>
  );
}
