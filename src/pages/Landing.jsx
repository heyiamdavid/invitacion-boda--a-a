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
import Footer from "../components/Footer";
import MusicButton from "../components/MusicButton";

export default function Landing() {
  const [open, setOpen] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

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
          <RSVP />
          <Footer />
        </>
      )}
      <MusicButton startMusic={startMusic} hidden={!open} />
    </>
  );
}