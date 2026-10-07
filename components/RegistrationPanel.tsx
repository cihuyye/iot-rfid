"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, Nfc, Save, ScanLine } from "lucide-react";
import type { AppMode, CardItem, MediaType } from "@/lib/types";
import { MEDIA_LABEL } from "@/lib/types";

interface Props {
  mode: AppMode;
  onModeChange: (m: AppMode) => void;
  uid: string;
  onUidChange: (uid: string) => void;
  onSave: (card: CardItem) => Promise<void>;
}

const PLACEHOLDER: Record<MediaType, string> = {
  audio: "https://contoh.com/lagu.mp3  atau  /media/lagu.mp3",
  video: "https://contoh.com/video.mp4  atau  /media/video.mp4",
  spotify: "https://open.spotify.com/track/...",
};

export default function RegistrationPanel({ mode, onModeChange, uid, onUidChange, onSave }: Props) {
  const registering = mode === "register";
  const [mediaType, setMediaType] = useState<MediaType>("audio");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [path, setPath] = useState("");
  const [cover, setCover] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const canSave = registering && uid.trim() && title.trim() && path.trim() && !saving;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    await onSave({
      uid,
      title: title.trim(),
      artist: artist.trim() || "Tidak diketahui",
      media_type: mediaType,
      path: path.trim(),
      cover: cover.trim() || undefined,
    });
    setSaving(false);
    setDone(true);
    setTitle("");
    setArtist("");
    setPath("");
    setCover("");
    onUidChange("");
    setTimeout(() => setDone(false), 2000);
  };

  const field =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky focus:ring-2 focus:ring-sky/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
  const label = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm transition-colors sm:p-6 ${
        registering ? "border-sky/40 bg-ice" : "border-line bg-white"
      }`}
    >
      {/* Toggle mode */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            {registering ? "Mode Registrasi" : "Mode Play"}
          </h3>
          <p className="text-xs font-medium text-slate-500">
            {registering
              ? "Scan kartu baru, UID terisi otomatis."
              : "Geser untuk mendaftarkan kartu baru."}
          </p>
        </div>
        <button
          role="switch"
          aria-checked={registering}
          onClick={() => onModeChange(registering ? "play" : "register")}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
            registering ? "bg-sky" : "bg-slate-300"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow ${
              registering ? "right-1" : "left-1"
            }`}
          />
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* UID */}
        <div>
          <label className={label} htmlFor="uid">
            UID Kartu
          </label>
          <div className="relative">
            <input
              id="uid"
              value={uid}
              onChange={(e) => onUidChange(e.target.value.toUpperCase())}
              disabled={!registering}
              placeholder={registering ? "Menunggu scan kartu…" : "Aktifkan Mode Registrasi"}
              className={`${field} pr-10 font-mono tracking-wider`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sky-deep">
              {registering && !uid ? (
                <Loader2 size={18} className="animate-spin" />
              ) : uid ? (
                <ScanLine size={18} />
              ) : (
                <Nfc size={18} className="text-slate-300" />
              )}
            </span>
          </div>
        </div>

        {/* Tipe media */}
        <div>
          <label className={label} htmlFor="type">
            Tipe Media
          </label>
          <select
            id="type"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as MediaType)}
            disabled={!registering}
            className={field}
          >
            {(Object.keys(MEDIA_LABEL) as MediaType[]).map((t) => (
              <option key={t} value={t}>
                {MEDIA_LABEL[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="title">
              Judul
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!registering}
              placeholder="Judul lagu / video"
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="artist">
              Artis / Album
            </label>
            <input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              disabled={!registering}
              placeholder="Nama artis atau album"
              className={field}
            />
          </div>
        </div>

        {/* Path / URL */}
        <div>
          <label className={label} htmlFor="path">
            Path / URL
          </label>
          <div className="relative">
            <Link2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              disabled={!registering}
              placeholder={PLACEHOLDER[mediaType]}
              className={`${field} pl-10`}
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="cover">
            URL Cover <span className="font-medium normal-case text-slate-400">(opsional)</span>
          </label>
          <input
            id="cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            disabled={!registering}
            placeholder="https://contoh.com/cover.jpg"
            className={field}
          />
        </div>

        <button
          type="submit"
          disabled={!canSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {done ? "Kartu tersimpan ✓" : "Simpan Kartu"}
        </button>
      </form>
    </section>
  );
}
