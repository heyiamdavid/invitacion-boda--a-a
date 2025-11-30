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

  const handleOpen = () => {
    setOpened(true);
  };

  useEffect(() => {
    document.body.style.overflow = opened ? "auto" : "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);

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
      {!opened && <Envelope onOpen={handleOpen} />}

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

          {!menuOpen && <MusicButton />}
        </>
      )}
    </>
  );
}
