import { Disc3, Film, Music2 } from "lucide-react";
import { coverGradient } from "@/lib/media";
import type { MediaType } from "@/lib/types";

interface Props {
  title: string;
  mediaType: MediaType;
  src?: string;
  className?: string;
  iconSize?: number;
}

/** Cover art: gambar jika ada, jika tidak gradient biru muda + ikon. */
export default function Cover({ title, mediaType, src, className = "", iconSize = 28 }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} className={`object-cover ${className}`} />;
  }
  const Icon = mediaType === "video" ? Film : mediaType === "spotify" ? Disc3 : Music2;
  return (
    <div
      className={`flex items-center justify-center text-white ${className}`}
      style={{ background: coverGradient(title) }}
      aria-label={title}
    >
      <Icon size={iconSize} strokeWidth={1.75} />
    </div>
  );
}
