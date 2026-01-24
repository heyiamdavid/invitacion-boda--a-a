import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Envelope from "../components/Envelope";
import Timeline from "../components/Timeline";
import Hospedaje from "../components/Hospedaje";
import Gallery from "../components/Gallery";
import RSVP from "../components/RSVP";
import Countdown from "../components/Countdown";
import Events from "../components/Events";
import Contact from "../components/Contact";
import SharePhotos from "../components/SharePhotos";
import Footer from "../components/Footer";
import MusicButton from "../components/MusicButton";

export default function Landing() {
  const [open, setOpen] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

  // 👤 Estado del invitado (Levantado para compartir entre RSVP y Fotos)
  const [guestId, setGuestId] = useState(() => localStorage.getItem("boda_guest_id"));
  const [guestName, setGuestName] = useState(() => localStorage.getItem("boda_guest_name"));

  console.log("Landing: render with guestId", guestId);

  const handleLogin = (id, name) => {
    console.log("Landing: handleLogin called with", id, name);
    localStorage.setItem("boda_guest_id", id);
    localStorage.setItem("boda_guest_name", name);
    setGuestId(id);
    setGuestName(name);
  };

  return (
    <>
      {!open ? (
        <Envelope
          onOpen={() => setOpen(true)}
          onStartMusic={() => setStartMusic(true)}
        />
      ) : (
        <>
          <Navbar />
          <Hero />
          <Countdown />
          <Events />
          <Timeline />
          <Hospedaje />
          <Gallery />
          <RSVP onLogin={handleLogin} />
          <SharePhotos guestId={guestId} guestName={guestName} />
          <Contact />
          <Footer />
        </>
      )}
      <MusicButton startMusic={startMusic} hidden={!open} />
    </>
  );
}