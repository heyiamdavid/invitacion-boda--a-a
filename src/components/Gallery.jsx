import { useState } from "react";
export default function Gallery() {
  const images = [
    "/assets/gallery/img1.jpeg",
    "/assets/gallery/img5.jpeg",
    "/assets/gallery/img3.jpeg",
    "/assets/gallery/img4.jpeg",
    "/assets/gallery/img2.jpeg",
    "/assets/gallery/img6.jpeg",
    "/assets/gallery/img7.jpeg",
    "/assets/gallery/img8.jpeg",
    "/assets/gallery/img9.jpg",
  ];

  const [current, setCurrent] = useState(null);
  const [startX, setStartX] = useState(0);

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

  return (
    <section className="section fade-in-section" id="galeria">
      <div className="section-content">
        <h2 className="section-title">Galería</h2>

        <div className="gallery-grid">
          {images.map((img, i) => (
            <div key={i} className="gallery-item" onClick={() => open(i)}>
              <img src={img} alt={`Foto ${i}`} loading="lazy" />
            </div>
          ))}
        </div>

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

            <button className="lightbox-btn left" onClick={(e) => {e.stopPropagation(); prev();}}>
              ‹
            </button>
            <button className="lightbox-btn right" onClick={(e) => {e.stopPropagation(); next();}}>
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
