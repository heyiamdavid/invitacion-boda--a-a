import { useState } from "react";

export default function Gallery() {
  const images = [
    "/assets/gallery/img1.webp",
    "/assets/gallery/img9.webp",
    "/assets/gallery/img11.webp",
    "/assets/gallery/img4.webp",
    "/assets/gallery/img5.webp",
    "/assets/gallery/img6.webp",
    "/assets/gallery/img7.webp",
    "/assets/gallery/img8.webp",
    "/assets/gallery/img2.webp",
    "/assets/gallery/img10.webp",
    "/assets/gallery/img3.webp",
    "/assets/gallery/img12.webp",
    "/assets/gallery/img13.webp",
    "/assets/gallery/img14.webp",
    "/assets/gallery/img15.webp",
    "/assets/gallery/img16.webp",
    "/assets/gallery/img17.webp",
    "/assets/gallery/img18.webp",
    "/assets/gallery/img19.webp",
    "/assets/gallery/img20.webp",
    "/assets/gallery/img21.webp",
    "/assets/gallery/img22.webp",
    "/assets/gallery/img23.webp",
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
    <section className="section fade-in-section paper-bg-clean" id="galeria">
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