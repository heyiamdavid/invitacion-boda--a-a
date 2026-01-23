import { useState, useRef, useEffect } from "react";
import { FaMusic } from "react-icons/fa";

export default function MusicButton({ startMusic, hidden }) {
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  const playlist = [
    "/assets/song/Camilo-LaBoda(Official Video).mp3",
    "/assets/song/Stephen_Sanchez_Until_I_Found_You_Official_VideoMP3_160K.mp3",
    "/assets/song/LATIN-MAFIA-Humbe-PatadasdeAhogado.mp3",
  ];

  /* ▶️ PLAY */
  const playMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
  };

  /* ⏸️ TOGGLE BOTÓN */
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      playMusic();
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  /* 🔥 ARRANCA DESDE EL CLICK DEL SOBRE */
  useEffect(() => {
    if (startMusic && !playing) {
      playMusic();
    }
  }, [startMusic]);

  /* 🔁 SIGUIENTE CANCIÓN */
  const handleEnded = () => {
    setCurrentSong((prev) => (prev + 1) % playlist.length);
  };

  /* ▶️ AUTO PLAY AL CAMBIAR DE CANCIÓN */
  useEffect(() => {
    if (!playing) return;

    const audio = audioRef.current;
    audio.load();
    audio.play().catch(() => {});
  }, [currentSong]);

  return (
    <>
      <button
        className={`music-btn ${playing ? "playing" : ""}`}
        style={{ display: hidden ? "none" : "block" }}
        onClick={toggleMusic}
        aria-label="Control de música"
      >
        <FaMusic />
      </button>

      {/* 🎵 EL AUDIO SIEMPRE EXISTE */}
      <audio
        ref={audioRef}
        src={playlist[currentSong]}
        preload="auto"
        onEnded={handleEnded}
      />
    </>
  );
}
