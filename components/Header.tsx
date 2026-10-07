"use client";

import { Cpu, Disc3, Globe, Wifi, WifiHigh, WifiLow, WifiOff } from "lucide-react";
import type { DeviceStatus } from "@/lib/types";

function SignalIcon({ rssi, online }: { rssi: number | null; online: boolean }) {
  if (!online || rssi === null) return <WifiOff size={16} />;
  if (rssi >= -60) return <Wifi size={16} />;
  if (rssi >= -75) return <WifiHigh size={16} />;
  return <WifiLow size={16} />;
}

export default function Header({ device, demo }: { device: DeviceStatus; demo: boolean }) {
  const { online, rssi, ip } = device;

  return (
    <header className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-white shadow-sm">
            <Disc3 size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-800">
              Jukebox Multimedia Interaktif
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Tempelkan kartu RFID, media langsung diputar
            </p>
          </div>
          {demo && (
            <span className="ml-1 hidden rounded-full bg-amberSoft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amberText sm:inline">
              Mode Demo
            </span>
          )}
        </div>

        {/* Telemetri perangkat */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status koneksi */}
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
              online
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {online && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  online ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
            </span>
            <Cpu size={14} />
            ESP8266 {online ? "ONLINE" : "OFFLINE"}
          </div>

          {/* RSSI */}
          <div className="flex items-center gap-1.5 rounded-full bg-sky/10 px-3 py-1.5 text-xs font-semibold text-sky-deep">
            <SignalIcon rssi={rssi} online={online} />
            {online && rssi !== null ? `${rssi} dBm` : "— dBm"}
          </div>

          {/* IP */}
          <div className="flex items-center gap-1.5 rounded-full bg-sky/10 px-3 py-1.5 font-mono text-xs font-semibold text-sky-deep">
            <Globe size={14} />
            {ip ?? "0.0.0.0"}
          </div>
        </div>
      </div>
    </header>
  );
}
