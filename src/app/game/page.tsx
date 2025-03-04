"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/game/Loading";

// Dynamically import the Game component with no SSR to avoid hydration issues with Three.js
const Game = dynamic(() => import("@/components/game/Game"), {
  ssr: false,
  loading: () => <Loading />
});

export default function GamePage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-stone-900">
      <Suspense fallback={<Loading />}>
        <Game />
      </Suspense>
    </main>
  );
} 