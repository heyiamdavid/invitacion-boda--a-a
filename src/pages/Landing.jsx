import { useState, lazy, Suspense } from "react";
import Envelope from "../components/Envelope";
import MusicButton from "../components/MusicButton";

// Lazy-loaded components for better performance
const Navbar = lazy(() => import("../components/Navbar"));
const Hero = lazy(() => import("../components/Hero"));
const Countdown = lazy(() => import("../components/Countdown"));
const Events = lazy(() => import("../components/Events"));
const Timeline = lazy(() => import("../components/Timeline"));
const Hospedaje = lazy(() => import("../components/Hospedaje"));
const Gallery = lazy(() => import("../components/Gallery"));
const RSVP = lazy(() => import("../components/RSVP"));
const SharePhotos = lazy(() => import("../components/SharePhotos"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

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
        <Suspense fallback={<div className="loading-fallback"></div>}>
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
        </Suspense>
      )}
      <MusicButton startMusic={startMusic} hidden={!open} />
    </>
  );
}