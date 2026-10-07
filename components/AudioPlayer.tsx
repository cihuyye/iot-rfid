"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import Cover from "./Cover";
import Waveform from "./Waveform";
import { formatTime } from "@/lib/media";
import type { CardItem } from "@/lib/types";

interface Props {
  card: CardItem;
  onAutoplayBlocked: () => void;
}

export default function AudioPlayer({ card, onAutoplayBlocked }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Putar otomatis setiap kartu berganti.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {
      setPlaying(false);
      onAutoplayBlocked();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.uid, card.path]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(onAutoplayBlocked);
    else el.pause();
  };

  const seek = (v: number) => {
    if (audioRef.current) audioRef.current.currentTime = v;
    setCurrent(v);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
      <Cover
        title={card.title}
        mediaType="audio"
        src={card.cover}
        iconSize={64}
        className="mx-auto aspect-square w-full max-w-[220px] rounded-2xl shadow-lg shadow-sky/20"
      />

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-deep">Sedang Diputar</p>
        <h2 className="mt-1 truncate text-2xl font-extrabold text-slate-800">{card.title}</h2>
        <p className="truncate text-sm font-medium text-slate-500">{card.artist}</p>

        <div className="my-4 rounded-xl bg-ice/60 px-4 py-3">
          <Waveform playing={playing} />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="w-10 text-right font-mono text-[11px] text-slate-500">
            {formatTime(current)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
            className="sky-range flex-1"
            style={{ ["--fill" as string]: `${progress}%` }}
            aria-label="Posisi lagu"
          />
          <span className="w-10 font-mono text-[11px] text-slate-500">{formatTime(duration)}</span>
        </div>

        {/* Kontrol */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={toggle}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sky text-white shadow-md shadow-sky/30 transition hover:bg-sky-deep active:scale-95"
            aria-label={playing ? "Jeda" : "Putar"}
          >
            {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
          </button>

          <div className="flex flex-1 items-center gap-3">
            <button
              onClick={() => setMuted((m) => !m)}
              className="text-sky-deep transition hover:text-sky"
              aria-label={muted ? "Aktifkan suara" : "Bisukan"}
            >
              {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setMuted(false);
              }}
              className="sky-range w-full max-w-[160px]"
              style={{ ["--fill" as string]: `${(muted ? 0 : volume) * 100}%` }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={card.path}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        hidden
      />
    </div>
  );
}
