"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PlayCircle, TriangleAlert } from "lucide-react";

interface Props {
  visible: boolean;
  onActivate: () => void;
}

export default function AutoplayBanner({ visible, onActivate }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amberSoft/80 p-4 text-amberText sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <TriangleAlert size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Browser memblokir pemutaran otomatis</p>
                <p className="text-xs font-medium opacity-90">
                  Klik tombol di samping sekali agar audio &amp; video bisa langsung
                  diputar saat kartu di-scan.
                </p>
              </div>
            </div>
            <button
              onClick={onActivate}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
            >
              <PlayCircle size={18} />
              Mulai Jukebox
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
