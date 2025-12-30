import { useState, useRef, useEffect } from "react";
import { FaMusic } from "react-icons/fa";

export default function MusicButton() {
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(null);

  /*  PLAYLIST */
  const playlist = [
    "assets/song/Camilo-LaBoda(Official Video).mp3",
    "assets/song/Stephen_Sanchez_Until_I_Found_You_Official_VideoMP3_160K.mp3",
    "assets/song/LATIN-MAFIA-Humbe-PatadasdeAhogado.mp3",
  ];

  /* PLAY / PAUSE */
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    if (!playing) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(err => console.log("Bloqueado:", err));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  /* CUANDO TERMINA UNA CANCIÓN */
  const handleEnded = () => {
    setCurrentSong((prev) => (prev + 1) % playlist.length);
  };

  /* CUANDO CAMBIA LA CANCIÓN, REPRODUCIR AUTOMÁTICAMENTE */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.load(); //  MUY IMPORTANTE
      audio
        .play()
        .catch(err => console.log("Cambio de pista bloqueado:", err));
    }
  }, [currentSong, playing]);

  return (
    <>
      <button
        className={`music-btn ${playing ? "playing" : ""}`}
        onClick={toggleMusic}
        aria-label="Reproducir música"
      >
        <FaMusic />
      </button>

      <audio
        ref={audioRef}
        src={playlist[currentSong]}
        preload="auto"
        onEnded={handleEnded}
      />
    </>
  );
}
