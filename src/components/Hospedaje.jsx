export default function Hospedaje() {
  const hotels = [
    {
      name: "Hotel Ejecutivo",
      address: "Calle Ejemplo #123, Zona Centro, Zamora",
      img: "/assets/hoteles/hotel1.jpg",
      maps: "https://maps.google.com/?q=Hotel+Ejecutivo+Zamora",
      coords: { lat: 19.989, lng: -102.283 }
    },
    {
      name: "Holiday Inn",
      address: "Av. Principal 456, Zona Norte, Zamora",
      img: "/assets/hoteles/hotel2.jpg",
      maps: "https://maps.google.com/?q=Holiday+Inn+Zamora",
      coords: { lat: 19.994, lng: -102.285 }
    },
    {
      name: "Hotel Boutique Jardín",
      address: "Camino de las Flores s/n, Cerrito de Ortiz",
      img: "/assets/hoteles/hotel3.jpg",
      maps: "https://maps.google.com/?q=Hotel+Boutique+Jardin+Zamora",
      coords: { lat: 19.997, lng: -102.279 }
    }
  ];

  const moveMap = (coords) => {
    const iframe = document.getElementById("hotel-map");
    iframe.src = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`;
  };

  return (
    <section className="section fade-in-section" id="hospedaje">
      <div className="section-content">
        <h2 className="section-title">Hospedaje Cercano</h2>

        <div className="map-wrapper">
          <iframe
            id="hotel-map"
            className="map-iframe"
            src="https://www.google.com/maps?q=Zamora+Michoacan&z=14&output=embed"
          ></iframe>
        </div>

        <div className="hoteles-grid">
          {hotels.map((h, i) => (
            <div className="hotel-card" key={i} onClick={() => moveMap(h.coords)}>
              <img src={h.img} className="hotel-img" />
              <div className="hotel-body">
                <div className="hotel-nombre">{h.name}</div>
                <div className="hotel-dir">{h.address}</div>

                <a
                  href={h.maps}
                  className="hotel-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver ubicación
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
