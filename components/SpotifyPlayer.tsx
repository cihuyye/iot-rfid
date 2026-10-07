import { spotifyHeight, toSpotifyEmbed } from "@/lib/media";
import type { CardItem } from "@/lib/types";

export default function SpotifyPlayer({ card }: { card: CardItem }) {
  const src = toSpotifyEmbed(card.path);
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-sky-deep">Sedang Diputar</p>
      <h2 className="mb-3 mt-1 truncate text-2xl font-extrabold text-slate-800">
        {card.title}
        <span className="ml-2 text-sm font-medium text-slate-500">· {card.artist}</span>
      </h2>
      <iframe
        key={card.uid}
        title={card.title}
        src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
        width="100%"
        height={spotifyHeight(card.path)}
        style={{ borderRadius: 16, border: 0 }}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      <p className="mt-2 text-[11px] font-medium text-slate-400">
        Spotify Embed mengikuti kebijakan Spotify; pemutaran penuh membutuhkan login di browser.
      </p>
    </div>
  );
}
