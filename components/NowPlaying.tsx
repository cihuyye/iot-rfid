"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Nfc, X } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import type { CardItem } from "@/lib/types";

interface Props {
  card: CardItem | null;
  onAutoplayBlocked: () => void;
  onStop: () => void;
}

export default function NowPlaying({ card, onAutoplayBlocked, onStop }: Props) {
  return (
    <section className="relative rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <AnimatePresence mode="wait">
        {card ? (
          <motion.div
            key={card.uid + card.path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onStop}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-ice hover:text-sky-deep"
              aria-label="Hentikan"
            >
              <X size={18} />
            </button>

            {card.media_type === "audio" && (
              <AudioPlayer card={card} onAutoplayBlocked={onAutoplayBlocked} />
            )}
            {card.media_type === "video" && (
              <VideoPlayer card={card} onAutoplayBlocked={onAutoplayBlocked} />
            )}
            {card.media_type === "spotify" && <SpotifyPlayer card={card} />}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-14 text-center"
          >
            <div className="relative mb-5">
              <span className="absolute inset-0 animate-ping rounded-full bg-sky/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ice text-sky-deep">
                <Nfc size={36} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-700">Menunggu kartu…</h2>
            <p className="mt-1 max-w-sm text-sm font-medium text-slate-500">
              Tempelkan kartu RFID ke pembaca MFRC522 atau pilih kartu dari katalog di bawah.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
