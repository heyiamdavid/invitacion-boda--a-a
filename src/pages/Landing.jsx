import { useState } from "react"; // ✅ AGREGADO
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Envelope from "../components/Envelope";
import Timeline from "../components/Timeline";
import Hospedaje from "../components/Hospedaje";
import Gallery from "../components/Gallery";
import RSVP from "../components/RSVP";
import Countdown from "../components/Countdown";
import Events from "../components/Events";
import MapSection from "../components/MapSection";
import Footer from "../components/Footer";
import MusicButton from "../components/MusicButton";

export default function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open ? (
        <Envelope onOpen={() => setOpen(true)} />
      ) : (
        <>
          <Navbar />
          <Hero />
          <Countdown />
          <Events />
          <Timeline />
          <Hospedaje />
          <MapSection />
          <Gallery />
          <RSVP />
          <Footer />
          <MusicButton />
        </>
      )}
    </>
  );
}