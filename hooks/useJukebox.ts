"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onValue, ref, remove, set } from "firebase/database";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { DEMO_CARDS } from "@/lib/demo-data";
import type { AppMode, CardItem, DeviceStatus } from "@/lib/types";

/** Perangkat dianggap OFFLINE jika heartbeat terakhir lebih lama dari ini. */
const OFFLINE_AFTER_MS = 20_000;

interface RawDevice {
  status?: string;
  rssi?: number;
  ip?: string;
  lastSeen?: number;
}

interface RawScan {
  uid?: string;
  ts?: number;
}

export function useJukebox() {
  const demo = !isFirebaseConfigured;

  const [cards, setCards] = useState<CardItem[]>(demo ? DEMO_CARDS : []);
  const [rawDevice, setRawDevice] = useState<RawDevice | null>(
    demo ? { status: "online", rssi: -52, ip: "192.168.1.42", lastSeen: Date.now() } : null
  );
  const [mode, setModeState] = useState<AppMode>("play");
  const [nowPlaying, setNowPlaying] = useState<CardItem | null>(null);
  const [registerUid, setRegisterUid] = useState("");
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(!demo);

  // Refs agar callback onValue selalu membaca nilai terbaru tanpa re-subscribe.
  const cardsRef = useRef<CardItem[]>(cards);
  const modeRef = useRef<AppMode>(mode);
  const lastScanTs = useRef<number | null>(null);
  const scanBaselineSet = useRef(false);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Ticker untuk menghitung ulang status ONLINE/OFFLINE.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  /** Dipanggil setiap ada UID baru terbaca (Firebase atau simulasi demo). */
  const handleScan = useCallback((uid: string) => {
    if (modeRef.current === "register") {
      setRegisterUid(uid);
      return;
    }
    const found = cardsRef.current.find((c) => c.uid === uid);
    if (found) setNowPlaying(found);
  }, []);

  // ---- Langganan Firebase Realtime Database ----
  useEffect(() => {
    const db = getDb();
    if (!db) return;

    const unsubs = [
      onValue(ref(db, "cards"), (snap) => {
        const val = snap.val() as Record<string, Omit<CardItem, "uid">> | null;
        const list: CardItem[] = val
          ? Object.entries(val).map(([uid, c]) => ({ uid, ...c }))
          : [];
        list.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
        setCards(list);
        setLoading(false);
      }),
      onValue(ref(db, "device"), (snap) => setRawDevice(snap.val() as RawDevice | null)),
      onValue(ref(db, "mode"), (snap) => {
        const v = snap.val();
        if (v === "play" || v === "register") setModeState(v);
      }),
      onValue(ref(db, "last_scan"), (snap) => {
        const v = snap.val() as RawScan | null;
        if (!v?.uid) {
          scanBaselineSet.current = true;
          return;
        }
        // Snapshot pertama = scan lama saat halaman dibuka. Jangan diputar.
        if (!scanBaselineSet.current) {
          scanBaselineSet.current = true;
          lastScanTs.current = v.ts ?? null;
          return;
        }
        // Scan kartu yang sama dua kali tetap valid selama ts berubah.
        if (v.ts !== undefined && v.ts === lastScanTs.current) return;
        lastScanTs.current = v.ts ?? null;
        handleScan(v.uid.toUpperCase());
      }),
    ];
    return () => unsubs.forEach((u) => u());
  }, [handleScan]);

  // ---- Status perangkat (turunan) ----
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void tick;
  const device: DeviceStatus = (() => {
    if (!rawDevice) return { online: false, rssi: null, ip: null, lastSeen: null };
    const fresh =
      demo || (rawDevice.lastSeen ? Date.now() - rawDevice.lastSeen < OFFLINE_AFTER_MS : false);
    return {
      online: rawDevice.status === "online" && fresh,
      rssi: rawDevice.rssi ?? null,
      ip: rawDevice.ip ?? null,
      lastSeen: rawDevice.lastSeen ?? null,
    };
  })();

  // ---- Aksi ----
  const setMode = useCallback(
    (m: AppMode) => {
      setModeState(m);
      if (m === "play") setRegisterUid("");
      const db = getDb();
      if (db) void set(ref(db, "mode"), m);
    },
    []
  );

  const saveCard = useCallback(async (card: CardItem) => {
    const uid = card.uid.trim().toUpperCase();
    const payload: CardItem = { ...card, uid, created_at: Date.now() };
    const db = getDb();
    if (db) {
      const { uid: _omit, ...rest } = payload;
      void _omit;
      await set(ref(db, `cards/${uid}`), rest);
    } else {
      setCards((prev) => [payload, ...prev.filter((c) => c.uid !== uid)]);
    }
  }, []);

  const deleteCard = useCallback(
    async (uid: string) => {
      const db = getDb();
      if (db) await remove(ref(db, `cards/${uid}`));
      else setCards((prev) => prev.filter((c) => c.uid !== uid));
      setNowPlaying((np) => (np?.uid === uid ? null : np));
    },
    []
  );

  const play = useCallback((card: CardItem) => setNowPlaying(card), []);
  const stop = useCallback(() => setNowPlaying(null), []);

  /** Hanya Mode Demo: meniru ESP8266 yang mengirim UID. */
  const simulateScan = useCallback(
    (uid: string) => {
      if (demo) handleScan(uid.toUpperCase());
    },
    [demo, handleScan]
  );

  return {
    demo,
    loading,
    cards,
    device,
    mode,
    setMode,
    nowPlaying,
    play,
    stop,
    registerUid,
    setRegisterUid,
    saveCard,
    deleteCard,
    simulateScan,
  };
}
