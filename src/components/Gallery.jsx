import { useState } from "react";

export default function Gallery() {
  const images = [
    "/assets/gallery/img1.jpeg",
    "/assets/gallery/img9.jpeg",
    "/assets/gallery/img11.jpeg",
    "/assets/gallery/img4.jpeg",
    "/assets/gallery/img5.jpeg",
    "/assets/gallery/img6.jpeg",
    "/assets/gallery/img7.jpeg",
    "/assets/gallery/img8.jpeg",
    "/assets/gallery/img2.jpeg",
    "/assets/gallery/img10.jpeg",
    "/assets/gallery/img3.jpeg",
    "/assets/gallery/img12.jpeg",
    "/assets/gallery/img13.jpeg",
    "/assets/gallery/img14.jpeg",
    "/assets/gallery/img15.jpeg",
    "/assets/gallery/img16.jpeg",
    "/assets/gallery/img17.jpeg",
    "/assets/gallery/img18.jpeg",
    "/assets/gallery/img19.jpeg",
    "/assets/gallery/img20.jpeg",
    "/assets/gallery/img21.jpeg",
    "/assets/gallery/img22.jpeg",
    "/assets/gallery/img23.jpeg",
  ];

  const [current, setCurrent] = useState(null);
  const [startX, setStartX] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const open = (i) => setCurrent(i);
  const close = () => setCurrent(null);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) next();
    if (diff < -50) prev();
  };

  const toggleShowAll = () => setShowAll(!showAll);

  // Determinar qué imágenes mostrar
  const displayImages = showAll ? images : images.slice(0, 3);

  return (
    <section className="section fade-in-section" id="galeria">
      <div className="section-content">
        <h2 className="section-title">Galería</h2>

        <div className="gallery-grid">
          {displayImages.map((img, i) => (
            <div key={i} className="gallery-item" onClick={() => open(i)}>
              <img src={img} alt={`Foto ${i}`} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Botón para mostrar más (solo visible en móviles) */}
        {images.length > 3 && (
          <div className="gallery-toggle-container">
            <button className="gallery-toggle-btn" onClick={toggleShowAll}>
              {showAll ? "Ver menos" : `Ver más`}
            </button>
          </div>
        )}

        {current !== null && (
          <div
            className="lightbox"
            onClick={close}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[current]}
              className="lightbox-img"
              alt=""
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="lightbox-btn left"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              ‹
            </button>
            <button
              className="lightbox-btn right"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}