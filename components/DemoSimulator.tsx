"use client";

import { Nfc } from "lucide-react";
import type { CardItem } from "@/lib/types";

/** Hanya tampil di Mode Demo: meniru ESP8266 yang mengirim UID ke Firebase. */
export default function DemoSimulator({
  cards,
  onScan,
}: {
  cards: CardItem[];
  onScan: (uid: string) => void;
}) {
  const randomUid = () =>
    Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
    )
      .join(":")
      .toUpperCase();

  return (
    <div className="rounded-2xl border border-dashed border-sky/50 bg-white p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-sky-deep">
        Simulator Scan (Mode Demo)
      </p>
      <p className="mb-3 text-xs font-medium text-slate-500">
        Firebase belum dikonfigurasi. Klik untuk meniru kartu yang ditempelkan ke MFRC522.
      </p>
      <div className="flex flex-wrap gap-2">
        {cards.slice(0, 4).map((c) => (
          <button
            key={c.uid}
            onClick={() => onScan(c.uid)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ice px-3 py-1.5 text-xs font-semibold text-sky-deep transition hover:bg-sky hover:text-white"
          >
            <Nfc size={14} />
            {c.title.length > 16 ? c.title.slice(0, 16) + "…" : c.title}
          </button>
        ))}
        <button
          onClick={() => onScan(randomUid())}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-sky hover:text-sky-deep"
        >
          <Nfc size={14} />
          Kartu Baru (UID acak)
        </button>
      </div>
    </div>
  );
}
