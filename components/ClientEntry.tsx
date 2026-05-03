/*
Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms. This client entry disables SSR for the WebGL-heavy shell while preserving a crisp light-mode loading surface.
*/
"use client";

import dynamic from "next/dynamic";

const MothdroneApp = dynamic(() => import("@/components/MothdroneApp"), {
  ssr: false,
  loading: () => (
    <main className="engineering-bg grid h-screen w-screen place-items-center text-[#1d2529]">
      <div className="panel-cut border border-black/15 bg-white/85 px-5 py-4 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#008b8b]">Initializing Mothdrone HPM Visualizer</p>
      </div>
    </main>
  ),
});

export default function ClientEntry() {
  return <MothdroneApp />;
}
