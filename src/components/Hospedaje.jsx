export default function Hospedaje() {
  const place = {
    name: "Hostería Rayo Rojo",
    address: "Av. Malecón, Salinas, Ecuador",
    img: "./assets/images/hospedaje.jpg",

    // Place ID de Google Maps
    placeId: "ChIJ43R56P8NLpARTkMzHEAVa9o",

    // Coordenadas correctas
    lat: -2.1955930,
    lng: -80.9858508,

    // URL corta de Google Maps
    googleMapsShort: "https://maps.app.goo.gl/onDaNkSDssTxP2Ft7",

    // URLs para diferentes plataformas
    mapsWeb:
      "https://www.google.com/maps/dir/?api=1&destination=Hoster%C3%ADa+Rayo+Rojo&destination_place_id=ChIJ43R56P8NLpARTkMzHEAVa9o",

    mapsIOS:
      "https://maps.apple.com/?daddr=Hoster%C3%ADa+Rayo+Rojo,Salinas,Ecuador&dirflg=d",

    // Waze URLs
    wazeDeepLink: `waze://?ll=-2.1955930,-80.9858508&navigate=yes&q=Hoster%C3%ADa%20Rayo%20Rojo`,
    wazeWeb: "https://www.waze.com/ul?ll=-2.1955930,-80.9858508&navigate=yes&q=Hoster%C3%ADa%20Rayo%20Rojo",
  };

  // Función para detectar si estamos en móvil
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Función para detectar iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  // Función para detectar Android
  const isAndroid = () => {
    return /android/i.test(navigator.userAgent);
  };

  // Función mejorada para Google Maps (sin errores de deep link)
  const handleNavigation = () => {
    // iOS - Usar Apple Maps o Google Maps web
    if (isIOS()) {
      // En iOS, abrimos directamente la URL de Apple Maps
      window.open(place.mapsIOS, "_blank");
      return;
    }

    // Android - Usar intent de Android o web
    if (isAndroid()) {
      // Intent de Android para abrir Google Maps
      const intentUrl = `intent://maps.google.com/maps?daddr=${place.lat},${place.lng}&dirflg=d#Intent;scheme=https;package=com.google.android.apps.maps;end`;
      
      // Intentar abrir con intent
      window.location.href = intentUrl;
      
      // Fallback después de 2 segundos
      setTimeout(() => {
        window.open(place.mapsWeb, "_blank");
      }, 2000);
      return;
    }

    // Desktop o otros - Abrir directamente en web
    window.open(place.mapsWeb, "_blank");
  };

  // Función mejorada para Waze (sin errores de deep link)
  const handleWaze = () => {
    if (isMobile()) {
      // Crear un iframe invisible para intentar abrir la app
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = place.wazeDeepLink;
      document.body.appendChild(iframe);

      // Esperar y luego abrir en web si no se abrió la app
      let appOpened = false;
      
      // Detectar si la app se abrió
      const startTime = Date.now();
      
      window.addEventListener('blur', () => {
        appOpened = true;
      }, { once: true });

      // Después de 1.5 segundos, si no se abrió la app, abrir web
      setTimeout(() => {
        document.body.removeChild(iframe);
        
        if (!appOpened && (Date.now() - startTime) < 2000) {
          window.open(place.wazeWeb, "_blank");
        }
      }, 1500);
    } else {
      // Desktop - abrir directamente en web
      window.open(place.wazeWeb, "_blank");
    }
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
                onClick={handleNavigation}
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