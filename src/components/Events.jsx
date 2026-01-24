export default function Events() {
  // 🔹 MISMA UBICACIÓN QUE HOSPEDAJE
  const place = {
    name: "Hostería Rayo Rojo",
    address: "Av. Malecón, Salinas, Ecuador",

    googleMaps:
      "https://www.google.com/maps/dir/?api=1&destination=Hoster%C3%ADa+Rayo+Rojo&destination_place_id=ChIJ43R56P8NLpARTkMzHEAVa9o",

    waze:
      "https://www.waze.com/ul?ll=-2.1955930,-80.9858508&navigate=yes&q=Hoster%C3%ADa%20Rayo%20Rojo",
  };

  const handleGoogleMaps = () => {
    window.location.href = place.googleMaps;
  };

  const handleWaze = () => {
    window.location.href = place.waze;
  };

  const events = [
    {
      icon: "/assets/images/anillo-icon.webp",
      title: "Ceremonia",
      date: "18 de Abril, 2026",
      time: "4:30 PM – 5:30 PM",
      place: place.name,
      address: place.address,
      showMaps: true,
    },
    {
      icon: "/assets/images/lista-icon.webp",
      title: "Recepción",
      date: "18 de Abril, 2026",
      time: "5:30 PM – 10:00 PM",
      place: place.name,
      address: place.address,
      showMaps: true,
    },
    {
      icon: "/assets/images/vestimenta-icon.webp",
      title: "Código de Vestimenta",
      date: "Forma - Rigurosa",
      time: "Ellos traje formal deberán usar, ellas de vestido largo estarán... Y juntos puntualmente llegarán. El color blanco y beige están reservados para los novios.",
      showMaps: false,
    },
    {
      icon: "/assets/images/regalo.webp",
      title: "Regalos",
      date: "Lluvia de sobres",
      time: "Su presencia es nuestro mayor regalo. Agradecemos mucho que tu regalo sea en sobre cerrado.",
      showMaps: false,
    },
  ];

  return (
    <section
      className="section fade-in-section paper-bg"
      id="cuando-donde"
    >
      {/* Flor derecha */}
      <div className="paper-flower-right"></div>

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
                <p
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.8,
                    whiteSpace: "pre-line",
                  }}
                >
                  {e.address}
                </p>
              )}

              {e.showMaps && (
                <div className="botones-mapa">
                  <button
                    className="btn-map"
                    onClick={handleGoogleMaps}
                  >
                    Cómo llegar (Maps)
                  </button>

                  <button
                    className="btn-map btn-waze"
                    onClick={handleWaze}
                  >
                    Abrir en Waze
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
