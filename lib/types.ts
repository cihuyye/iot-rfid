export type MediaType = "audio" | "video" | "spotify";

export interface CardItem {
  uid: string;
  title: string;
  artist: string;
  media_type: MediaType;
  /** URL / path file MP3 atau MP4, atau tautan Spotify */
  path: string;
  cover?: string;
  created_at?: number;
}

export interface DeviceStatus {
  online: boolean;
  rssi: number | null;
  ip: string | null;
  lastSeen: number | null;
}

export type AppMode = "play" | "register";

export const MEDIA_LABEL: Record<MediaType, string> = {
  audio: "Audio MP3",
  video: "Video MP4",
  spotify: "Spotify Embed",
};
