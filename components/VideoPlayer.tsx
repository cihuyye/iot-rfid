"use client";

import { useEffect, useRef } from "react";
import type { CardItem } from "@/lib/types";

interface Props {
  card: CardItem;
  onAutoplayBlocked: () => void;
}

export default function VideoPlayer({ card, onAutoplayBlocked }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.load();
    el.play().catch(onAutoplayBlocked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.uid, card.path]);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-sky-deep">Sedang Diputar</p>
      <h2 className="mb-3 mt-1 truncate text-2xl font-extrabold text-slate-800">
        {card.title}
        <span className="ml-2 text-sm font-medium text-slate-500">· {card.artist}</span>
      </h2>
      <div className="overflow-hidden rounded-2xl border-2 border-sky/40 bg-black shadow-lg shadow-sky/10">
        <video
          ref={ref}
          src={card.path}
          controls
          playsInline
          preload="auto"
          className="aspect-video w-full bg-black"
        />
      </div>
    </div>
  );
}
