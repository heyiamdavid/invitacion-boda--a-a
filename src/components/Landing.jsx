import { useEffect, useState } from "react";
import Envelope from "../components/Envelope";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Countdown from "../components/Countdown";
import Events from "../components/Events";
import Hospedaje from "../components/Hospedaje";
import Gallery from "../components/Gallery";
import RSVP from "../components/RSVP";
import Footer from "../components/Footer";
import MusicButton from "../components/MusicButton";

export default function Landing() {
  const [opened, setOpened] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  /* ✉️ CLICK EN EL SOBRE */
  const handleOpen = () => {
    setOpened(true);
    setMusicStarted(true); // 🎵 DESBLOQUEA EL AUDIO
  };

  /* 🚫 BLOQUEAR SCROLL HASTA ABRIR */
  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [opened]);

  /* ✨ FADE IN SECCIONES */
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ✉️ SOBRE */}
      {!opened && <Envelope onOpen={handleOpen} />}

      {/* 📄 CONTENIDO */}
      {opened && (
        <>
          <Navbar onMenuToggle={setMenuOpen} />

          <main id="main-content">
            <Hero />
            <Countdown />
            <Events />
            <Hospedaje />
            <Gallery />
            <RSVP />
            <Footer />
          </main>
        </>
      )}

      {/* 🎵 SIEMPRE MONTADO */}
      <MusicButton
        startMusic={musicStarted}
        hidden={!opened || menuOpen}
      />
    </>
  );
}
