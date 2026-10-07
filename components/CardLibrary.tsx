"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Search, Trash2 } from "lucide-react";
import Cover from "./Cover";
import type { CardItem, MediaType } from "@/lib/types";
import { MEDIA_LABEL } from "@/lib/types";

const BADGE: Record<MediaType, string> = {
  audio: "bg-sky/15 text-sky-deep", // Sky Blue
  video: "bg-ice text-blue-700", // Ice Blue
  spotify: "bg-mint text-teal-700", // Mint Blue
};

interface Props {
  cards: CardItem[];
  selectedUid?: string;
  loading: boolean;
  onSelect: (card: CardItem) => void;
  onDelete: (uid: string) => void;
}

export default function CardLibrary({ cards, selectedUid, loading, onSelect, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmUid, setConfirmUid] = useState<string | null>(null);

  const filtered = cards.filter((c) =>
    `${c.title} ${c.artist} ${c.uid}`.toLowerCase().includes(query.toLowerCase())
  );

  const copy = async (uid: string) => {
    try {
      await navigator.clipboard.writeText(uid);
      setCopied(uid);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard bisa diblokir di konteks non-HTTPS */
    }
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Library Kartu</h3>
          <p className="text-xs font-medium text-slate-500">{cards.length} kartu terdaftar</p>
        </div>
        <div className="relative sm:w-64">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, artis, UID…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky focus:ring-2 focus:ring-sky/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-line bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-12 text-center text-sm font-medium text-slate-400">
          {cards.length === 0
            ? "Belum ada kartu. Aktifkan Mode Registrasi lalu scan kartu pertamamu."
            : "Tidak ada kartu yang cocok."}
        </div>
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((c) => {
              const selected = c.uid === selectedUid;
              return (
                <motion.article
                  layout
                  key={c.uid}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelect(c)}
                  className={`group cursor-pointer rounded-2xl border bg-white p-3.5 shadow-sm transition-colors hover:shadow-md hover:shadow-sky/10 ${
                    selected ? "border-sky ring-2 ring-sky/30" : "border-line hover:border-sky/50"
                  }`}
                >
                  <div className="flex gap-3.5">
                    <Cover
                      title={c.title}
                      mediaType={c.media_type}
                      src={c.cover}
                      className="h-20 w-20 shrink-0 rounded-xl shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${BADGE[c.media_type]}`}
                      >
                        {MEDIA_LABEL[c.media_type]}
                      </span>
                      <h4 className="mt-1 truncate text-sm font-bold text-slate-800">{c.title}</h4>
                      <p className="truncate text-xs font-medium text-slate-500">{c.artist}</p>
                      <p className="mt-1 truncate font-mono text-[11px] font-semibold tracking-wider text-slate-400">
                        {c.uid}
                      </p>
                    </div>
                  </div>

                  <div
                    className="mt-3 flex items-center justify-end gap-1.5 border-t border-line pt-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => copy(c.uid)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-deep transition hover:bg-ice"
                    >
                      {copied === c.uid ? <Check size={14} /> : <Copy size={14} />}
                      {copied === c.uid ? "Tersalin" : "Salin UID"}
                    </button>
                    {confirmUid === c.uid ? (
                      <button
                        onClick={() => {
                          onDelete(c.uid);
                          setConfirmUid(null);
                        }}
                        onBlur={() => setConfirmUid(null)}
                        autoFocus
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                        Yakin hapus?
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmUid(c.uid)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
