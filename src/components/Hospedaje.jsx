export default function Hospedaje() {
  const place = {
    name: "Hostería Rayo Rojo",
    address: "Av. Malecón, Salinas, Ecuador",
    img: "./assets/images/hospedaje.jpg",

    // Place ID de Google Maps
    placeId: "ChIJ43R56P8NLpARTkMzHEAVa9o",

    // Coordenadas
    lat: -2.1955930,
    lng: -80.9858508,

    // Google Maps - URL universal que funciona en todos los dispositivos
    googleMaps: "https://www.google.com/maps/dir/?api=1&destination=Hoster%C3%ADa+Rayo+Rojo&destination_place_id=ChIJ43R56P8NLpARTkMzHEAVa9o",

    // Waze - URL universal que funciona en todos los dispositivos
    waze: "https://www.waze.com/ul?ll=-2.1955930,-80.9858508&navigate=yes&q=Hoster%C3%ADa%20Rayo%20Rojo",
  };

  // Función para abrir Google Maps (sin pop-up bloqueado)
  const handleGoogleMaps = () => {
    // Usar window.location.href en lugar de window.open
    // Esto NO es bloqueado por los navegadores
    window.location.href = place.googleMaps;
  };

  // Función para abrir Waze (sin pop-up bloqueado)
  const handleWaze = () => {
    // Usar window.location.href en lugar de window.open
    window.location.href = place.waze;
  };

  return (
    <section className="section fade-in-section" id="hospedaje">
      <h2 className="section-title">Ubicación</h2>

      {/* MAPA EMBEBIDO */}
      <div className="map-wrapper">
        <iframe
          className="map-iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.8892595262823!2d-80.98803682525398!3d-2.195593037855343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902e0dffe87974e3%3A0xda6b15401c33434e!2sHoster%C3%ADa%20Rayo%20Rojo!5e0!3m2!1ses-419!2sec!4v1735401234567!5m2!1ses-419!2sec"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Hostería Rayo Rojo"
        ></iframe>
      </div>

      {/* CARD DEL LUGAR */}
      <div className="hoteles-grid">
        <div className="hotel-card">
          <img
            src={place.img}
            className="hotel-img"
            alt={place.name}
          />

          <div className="hotel-body">
            <div className="hotel-nombre">{place.name}</div>
            <div className="hotel-dir">{place.address}</div>

            <div className="botones-mapa">
              {/* BOTÓN GOOGLE MAPS */}
              <button
                onClick={handleGoogleMaps}
                className="btn-map"
                aria-label="Abrir en Google Maps"
              >
                Cómo llegar (Maps)
              </button>

              {/* BOTÓN WAZE */}
              <button
                onClick={handleWaze}
                className="btn-map btn-waze"
                aria-label="Abrir en Waze"
              >
                Abrir en Waze
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}