import { useEffect, useState } from "react";
export default function Countdown() {
  const weddingDate = new Date("2026-04-18T00:00:00");

  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = weddingDate - now;

      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

      setTime({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const labels = {
    days: "Dias",
    hours: "Horas",
    minutes: "Minutos",
    seconds: "Segundos",
  };

  return (
    
    <section id="countdown" className="countdown fade-in-section paper-bg-clean">
      <h2 className="countdown-title">18 de abril del 2026</h2>

      <p className="countdown-date">Faltan</p>

      <div className="countdown-grid">
        {Object.entries(time).map(([label, value]) => (
          <div key={label} className="countdown-box">
            <span className="count-value">{value}</span>
            <span className="count-label">{labels[label]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
