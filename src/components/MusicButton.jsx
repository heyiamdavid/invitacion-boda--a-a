import { useState, useRef } from "react";
import { FaMusic } from "react-icons/fa";

export default function MusicButton() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    if (!playing) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => console.log("🔇 Bloqueado:", err));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

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
        loop
        preload="auto"
        src="assets/song/Stephen_Sanchez_Until_I_Found_You_Official_VideoMP3_160K.mp3"
      />
    </>
  );
}
