/*
Design philosophy reminder: Swiss International Style adapted for aerospace technical review rooms. This RTL dashboard uses crisp Arabic command copy, English technical terms, tabular telemetry, and explicit operational controls without dark-mode treatment.
*/
"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Crosshair, Gauge, RadioTower, SplitSquareHorizontal, Zap } from "lucide-react";

type MissionControlUIProps = {
  exploded: boolean;
  attack: boolean;
  onExplodedChange: (value: boolean) => void;
  onAttackChange: (value: boolean) => void;
};

type Telemetry = {
  ganTemp: number;
  busVoltage: number;
  fieldStrength: number;
  capacitorCharge: number;
  phaseError: number;
};

const BASE_TELEMETRY: Telemetry = {
  ganTemp: 61.8,
  busVoltage: 810,
  fieldStrength: 10.7,
  capacitorCharge: 96.4,
  phaseError: 0.032,
};

function jitter(base: number, amplitude: number) {
  return base + (Math.random() - 0.5) * amplitude;
}

export default function MissionControlUI({ exploded, attack, onExplodedChange, onAttackChange }: MissionControlUIProps) {
  const [telemetry, setTelemetry] = useState<Telemetry>(BASE_TELEMETRY);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTelemetry({
        ganTemp: jitter(attack ? 68.4 : 61.8, 1.6),
        busVoltage: jitter(attack ? 842 : 810, 9),
        fieldStrength: jitter(attack ? 14.2 : 10.7, 0.7),
        capacitorCharge: jitter(attack ? 88.2 : 96.4, 1.8),
        phaseError: Math.max(0.008, jitter(attack ? 0.019 : 0.032, 0.012)),
      });
    }, 180);
    return () => window.clearInterval(id);
  }, [attack]);

  const rows = useMemo(
    () => [
      { label: "GaN Temp", value: `${telemetry.ganTemp.toFixed(1)} °C`, icon: Gauge },
      { label: "DC Bus", value: `${telemetry.busVoltage.toFixed(0)} V`, icon: Zap },
      { label: "E-Field", value: `${telemetry.fieldStrength.toFixed(1)} MV/m`, icon: RadioTower },
      { label: "KVI-3 Charge", value: `${telemetry.capacitorCharge.toFixed(1)}%`, icon: Activity },
      { label: "Phase Error", value: `${telemetry.phaseError.toFixed(3)}°`, icon: Crosshair },
    ],
    [telemetry],
  );

  return (
    <aside
      dir="rtl"
      className="panel-cut pointer-events-auto flex h-full w-full max-w-[390px] flex-col overflow-y-auto border border-black/15 bg-white/88 p-5 shadow-[0_24px_80px_rgba(29,37,41,0.16)] backdrop-blur-md"
      aria-label="لوحة التحكم بالمهمة"
    >
      <div className="border-b border-black/10 pb-4">
        <p className="font-['IBM_Plex_Sans_Arabic'] text-xs font-semibold tracking-[0.22em] text-[#008b8b]">MISSION CONTROL</p>
        <h1 className="mt-2 font-['IBM_Plex_Sans_Arabic'] text-2xl font-bold leading-tight text-[#1d2529]">
          منصة عرض حمولة <span dir="ltr" className="inline-block">Mothdrone HPM</span>
        </h1>
        <p className="mt-2 font-['IBM_Plex_Sans_Arabic'] text-sm leading-6 text-[#667177]">
          عرض هندسي حي للمكدس الداخلي بدون Radome، بمحور طولي أفقي <span dir="ltr">Z-axis</span> من القاعدة إلى رأس الإطلاق.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3" dir="ltr">
        <div className={attack ? "flash-firing panel-cut px-3 py-3 text-center text-xs font-bold tracking-[0.18em]" : "panel-cut bg-[#d9362e]/5 px-3 py-3 text-center text-xs font-bold tracking-[0.18em] text-[#d9362e]"}>
          {attack ? "FIRING" : "SAFE"}
        </div>
        <div className="flash-locked panel-cut px-3 py-3 text-center text-xs font-bold tracking-[0.18em]">LOCKED</div>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel-cut grid grid-cols-[34px_1fr_auto] items-center gap-3 border border-black/10 bg-[#fbfaf6]/95 p-3" dir="ltr">
            <div className="grid h-8 w-8 place-items-center border border-[#008b8b]/25 bg-[#008b8b]/8 text-[#008b8b]">
              <Icon size={16} strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#667177]">{label}</div>
              <div className="telemetry-number mt-0.5 text-lg font-bold text-[#1d2529]">{value}</div>
            </div>
            <div className="h-7 w-1 bg-[#d6a629]" />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-[#00b4e8]/30 pt-5">
        <button
          type="button"
          onClick={() => onExplodedChange(!exploded)}
          className="panel-cut flex w-full items-center justify-between border border-[#00b4e8]/40 bg-[#0f1419]/80 px-4 py-3 text-left text-[#e8eef5] transition hover:-translate-y-0.5 hover:border-[#00b4e8]/70 hover:shadow-lg hover:shadow-[#00b4e8]/20"
          aria-pressed={exploded}
          dir="ltr"
        >
          <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]"><SplitSquareHorizontal size={17} /> Exploded View</span>
          <span className="telemetry-number text-sm font-bold text-[#00b4e8]">{exploded ? "100mm GAP" : "INLINE"}</span>
        </button>
        <button
          type="button"
          onClick={() => onAttackChange(!attack)}
          className={`panel-cut flex w-full items-center justify-between px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${attack ? "border border-[#ff4444] bg-[#ff4444] text-white" : "border border-[#ffd700]/50 bg-[#ffd700]/12 text-[#e8eef5]"}`}
          aria-pressed={attack}
          dir="ltr"
        >
          <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]"><Zap size={17} /> HPM Attack Pulse</span>
          <span className="telemetry-number text-sm font-bold">{attack ? "EMITTING" : "ARMED"}</span>
        </button>
      </div>

      <div className="mt-auto pt-5 font-['IBM_Plex_Sans_Arabic'] text-xs leading-5 text-[#a8b8d0]">
        <div className="flex items-center justify-between border-t border-[#00b4e8]/30 pt-4">
          <span>اتجاه الطاقة</span>
          <span dir="ltr" className="font-bold text-[#e8eef5]">Base Z=0 → Apex Z=500mm</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span>حالة العرض</span>
          <span dir="ltr" className="font-bold text-[#00b4e8]">NO FOG / NO RADOME / DARK MODE</span>
        </div>
      </div>
    </aside>
  );
}
