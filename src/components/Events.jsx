export default function Events() {
  const events = [
    {
      icon: "/assets/images/anillo-icon.png",
      title: "Ceremonia",
      date: "18 de Abril, 2026",
      time: "12:00 PM – 1:00 PM",
      place: "Templo de San Pedro y San Pablo",
      address: "Parota, Ario de Rosales\nZamora, Michoacán",
      links: [
        { text: "Llegar con Waze", url: "https://waze.com/" },
        { text: "Ver mapa", url: "https://maps.google.com/" },
      ],
    },
    {
      icon: "/assets/images/lista-icon.png",
      title: "Recepción",
      date: "18 de Abril, 2026",
      time: "2:00 PM – 1:00 AM",
      place: "Hacienda Cañipato",
      address: "Av. de las Flores s/n\nCerrito de Ortiz, Zamora, Mich.",
      links: [
        { text: "Llegar con Waze", url: "https://waze.com/" },
        { text: "Ver mapa", url: "https://maps.google.com/" },
      ],
    },
    {
      icon: "/assets/images/vestimenta-icon.png",
      title: "Código de Vestimenta",
      date: "Cocktail",
      time: "Vestimenta formal y elegante para celebrar juntos",
      links: [],
    },
  ];

  return (
    <section className="section fade-in-section" id="cuando-donde">
      <div className="section-content">
        <h2 className="section-title">Cuándo y Dónde</h2>

        <div className="evento-grid">
          {events.map((e, i) => (
            <div className="evento-card" key={i}>
              <img src={e.icon} alt={e.title} className="evento-icon" />
              <h3>{e.title}</h3>
              <p><strong>{e.date}</strong></p>
              <p>{e.time}</p>
              {e.place && <p>{e.place}</p>}
              {e.address && (
                <p style={{ fontSize: "0.9rem", opacity: 0.8, whiteSpace: "pre-line" }}>
                  {e.address}
                </p>
              )}
              {e.links.length > 0 && (
                <div className="botones-mapa">
                  {e.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.url}
                      className="btn-map"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
