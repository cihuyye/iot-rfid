"use client";

import { useState } from "react";
import AutoplayBanner from "@/components/AutoplayBanner";
import CardLibrary from "@/components/CardLibrary";
import DemoSimulator from "@/components/DemoSimulator";
import Header from "@/components/Header";
import NowPlaying from "@/components/NowPlaying";
import RegistrationPanel from "@/components/RegistrationPanel";
import { useJukebox } from "@/hooks/useJukebox";

export default function Home() {
  const jb = useJukebox();
  // Banner tampil sampai user melakukan gesture pertama (klik "Mulai Jukebox").
  const [activated, setActivated] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const showBanner = !activated || blocked;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
      <Header device={jb.device} demo={jb.demo} />

      <AutoplayBanner
        visible={showBanner}
        onActivate={() => {
          setActivated(true);
          setBlocked(false);
        }}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-5">
          <NowPlaying
            card={jb.nowPlaying}
            onAutoplayBlocked={() => setBlocked(true)}
            onStop={jb.stop}
          />
          {jb.demo && <DemoSimulator cards={jb.cards} onScan={jb.simulateScan} />}
        </div>

        <RegistrationPanel
          mode={jb.mode}
          onModeChange={jb.setMode}
          uid={jb.registerUid}
          onUidChange={jb.setRegisterUid}
          onSave={jb.saveCard}
        />
      </div>

      <CardLibrary
        cards={jb.cards}
        selectedUid={jb.nowPlaying?.uid}
        loading={jb.loading}
        onSelect={jb.play}
        onDelete={jb.deleteCard}
      />
    </main>
  );
}
