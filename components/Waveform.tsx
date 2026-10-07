const BARS = 32;

/** Visualizer bar bernuansa biru muda. Bergerak hanya saat `playing`. */
export default function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-16 items-end justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => {
        // Tinggi dasar & delay dibuat pseudo-acak tapi deterministik.
        const base = 30 + ((i * 37) % 55);
        const delay = ((i * 53) % 100) / 100;
        const duration = 0.7 + ((i * 29) % 60) / 100;
        return (
          <span
            key={i}
            className={`w-1.5 origin-bottom rounded-full bg-gradient-to-t from-sky to-sky-300 ${
              playing ? "animate-wave" : ""
            }`}
            style={{
              height: `${base}%`,
              transform: playing ? undefined : "scaleY(0.2)",
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transition: "transform 0.3s",
            }}
          />
        );
      })}
    </div>
  );
}
