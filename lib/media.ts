/** Ubah tautan Spotify biasa menjadi URL embed resmi. */
export function toSpotifyEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/embed")) return u.toString();
    return `https://open.spotify.com/embed${u.pathname}`;
  } catch {
    return url;
  }
}

export function spotifyHeight(url: string): number {
  return /\/(track|episode)\//.test(url) ? 152 : 352;
}

export function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

/** Gradient cover biru muda yang konsisten per judul. */
export function coverGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = 190 + (h % 30); // rentang cyan - sky
  return `linear-gradient(135deg, hsl(${hue} 90% 82%), hsl(${hue + 15} 85% 62%))`;
}
