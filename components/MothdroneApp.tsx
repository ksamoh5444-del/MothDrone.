/*
Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms. This client shell owns all live state, preserves the asymmetric instrument-console layout, and mounts WebGL only after hydration.
*/
"use client";

import { useEffect, useState } from "react";
import MissionControlUI from "@/components/MissionControlUI";
import MothdroneScene from "@/components/MothdroneScene";

const BAY_BACKGROUND =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663622408734/XdTJgRDLNhZ3p2NMbjwgUP/mothdrone-technical-bay-JuUFfRKSF33do7BTKWeZ4T.webp";

function WebGLLoadingPanel() {
  return (
    <div className="grid h-full w-full place-items-center bg-[#0a0e12] text-[#e8eef5]">
      <div className="panel-cut border border-[#00b4e8] bg-[#141a24]/96 px-5 py-4 shadow-xl shadow-[#00b4e8]/20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00b4e8]">Initializing WebGL Payload Bay</p>
      </div>
    </div>
  );
}

export default function MothdroneApp() {
  const [exploded, setExploded] = useState(false);
  const [attack, setAttack] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="engineering-bg relative h-screen w-screen overflow-hidden text-[#e8eef5]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{ backgroundImage: `url(${BAY_BACKGROUND})`, backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-8 top-6 z-10 flex items-start justify-between border-t border-[#00b4e8]/30 pt-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#00b4e8]">Technical Judging Committee · Payload Visualizer</p>
          <h2 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[#e8eef5]">Mothdrone HPM Naked Engineering Stack</h2>
        </div>
        <div className="panel-cut border border-[#00b4e8] bg-[#141a24]/92 px-4 py-3 text-right shadow-lg shadow-[#00b4e8]/20 backdrop-blur-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8b8d0]">Longitudinal Alignment</p>
          <p className="telemetry-number mt-1 text-lg font-bold text-[#e8eef5]">Z=0mm → Z=500mm</p>
        </div>
      </div>

      <section className="relative z-[1] grid h-full grid-cols-1 gap-4 p-5 pt-24 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="panel-cut relative min-h-0 overflow-hidden border border-[#00b4e8]/40 bg-[#0f1419]/60 shadow-[0_30px_120px_rgba(0,180,232,0.08)]">
          <div className="absolute left-5 top-5 z-10 flex gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8b8d0]">
            <span className="border border-[#00b4e8]/50 bg-[#141a24]/80 px-3 py-2">NO RADOME</span>
            <span className="border border-[#00b4e8]/50 bg-[#141a24]/80 px-3 py-2">NO FOG</span>
            <span className="border border-[#00b4e8]/50 bg-[#141a24]/80 px-3 py-2">PBR WAREHOUSE</span>
          </div>
          {mounted ? <MothdroneScene exploded={exploded} attack={attack} /> : <WebGLLoadingPanel />}
        </div>

        <MissionControlUI
          exploded={exploded}
          attack={attack}
          onExplodedChange={setExploded}
          onAttackChange={setAttack}
        />
      </section>
    </main>
  );
}
