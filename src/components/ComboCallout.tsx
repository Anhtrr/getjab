"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import type {
  ParsedPunch,
  CalloutState,
  CalloutSettings,
  CalloutPacing,
} from "@/lib/types";
import { isAudioAvailable } from "@/lib/comboAudio";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

// ─── Color system by punch type ───

const STAGGER_MS = 150;

const PUNCH_COLORS: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  straight: {
    text: "#00e5ff",
    border: "rgba(0, 229, 255, 0.4)",
    bg: "rgba(0, 229, 255, 0.08)",
    glow: "0 0 20px rgba(0, 229, 255, 0.35), 0 0 40px rgba(0, 229, 255, 0.15)",
  },
  hook: {
    text: "#ff6b35",
    border: "rgba(255, 107, 53, 0.4)",
    bg: "rgba(255, 107, 53, 0.08)",
    glow: "0 0 20px rgba(255, 107, 53, 0.35), 0 0 40px rgba(255, 107, 53, 0.15)",
  },
  uppercut: {
    text: "#a855f7",
    border: "rgba(168, 85, 247, 0.4)",
    bg: "rgba(168, 85, 247, 0.08)",
    glow: "0 0 20px rgba(168, 85, 247, 0.35), 0 0 40px rgba(168, 85, 247, 0.15)",
  },
  defense: {
    text: "#10b981",
    border: "rgba(16, 185, 129, 0.4)",
    bg: "rgba(16, 185, 129, 0.08)",
    glow: "0 0 20px rgba(16, 185, 129, 0.35), 0 0 40px rgba(16, 185, 129, 0.15)",
  },
};

// ─── Row layout by punch count ───

function getRowLayout(count: number, isWide: boolean): number[][] {
  // Wide screens (iPad): everything in 1 row
  if (isWide) {
    return [Array.from({ length: count }, (_, i) => i)];
  }
  // Phone: split into rows
  switch (count) {
    case 1: return [[0]];
    case 2: return [[0, 1]];
    case 3: return [[0, 1], [2]];
    case 4: return [[0, 1], [2, 3]];
    case 5: return [[0, 1, 2], [3, 4]];
    case 6: return [[0, 1, 2], [3, 4, 5]];
    default: {
      const rows: number[][] = [];
      for (let i = 0; i < count; i += 3) {
        rows.push(Array.from({ length: Math.min(3, count - i) }, (_, j) => i + j));
      }
      return rows;
    }
  }
}

// ─── Punch Card ───

function PunchCard({
  punch,
  index,
  phase,
  compact,
}: {
  punch: ParsedPunch;
  index: number;
  phase: string;
  compact: boolean;
}) {
  const colors = PUNCH_COLORS[punch.type] || PUNCH_COLORS.straight;
  const isActive = phase === "entering" || phase === "holding";

  return (
    <div
      className={`
        w-full h-full flex flex-col items-center justify-center rounded-xl
        ${isActive ? "animate-punch-slam" : "opacity-0 scale-75 translate-y-3"}
        ${phase === "holding" ? "animate-punch-breathe" : ""}
      `}
      style={{
        border: `3px solid ${isActive ? colors.border : "transparent"}`,
        background: isActive ? colors.bg : "transparent",
        boxShadow: isActive ? colors.glow : "none",
        animationDelay: phase === "entering" ? `${index * STAGGER_MS}ms` : undefined,
      }}
    >
      <span
        className={`font-mono font-black leading-none ${
          typeof punch.number === "string"
            ? (compact ? "text-sm" : "text-base")
            : (compact ? "text-3xl" : "text-5xl")
        }`}
        style={{ color: colors.text }}
      >
        {punch.number}
      </span>
      <span
        className={`font-bold uppercase tracking-wider mt-1 ${compact ? "text-[10px]" : "text-xs"}`}
        style={{ color: colors.text, opacity: 0.8 }}
      >
        {punch.shortName}
      </span>
      {punch.target === "body" && (
        <span className={`font-bold uppercase text-amber-400 mt-0.5 ${compact ? "text-[7px]" : "text-[9px]"}`}>
          BODY
        </span>
      )}
    </div>
  );
}

// ─── Connector Dash ───

function Connector({ index, phase }: { index: number; phase: string }) {
  const isActive = phase === "entering" || phase === "holding";
  return (
    <div
      className={`w-2.5 h-0.5 rounded-full shrink-0 ${
        isActive ? "bg-muted animate-fade-in" : "opacity-0"
      }`}
      style={{
        opacity: isActive ? 0.4 : 0,
        animationDelay: phase === "entering" ? `${index * STAGGER_MS}ms` : undefined,
        animationFillMode: "both",
      }}
    />
  );
}

// ─── Idle State (between combos) ───

function ComboIdle() {
  return (
    <div className="text-center py-6">
      <p className="text-muted text-sm animate-pulse-ready">Get ready...</p>
    </div>
  );
}

// ─── Active Combo Display ───

const WIDE_THRESHOLD = 500;

function ActiveCombo({
  state,
}: {
  state: CalloutState;
}) {
  const { activeCombo, phase } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setIsWide(entries[0].contentRect.width >= WIDE_THRESHOLD);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!activeCombo) return null;

  const punches = activeCombo.punches;
  const rows = getRowLayout(punches.length, isWide);
  const maxCols = Math.max(...rows.map(r => r.length));
  const compact = maxCols >= 3;
  const cardAspect = rows.length === 1 ? "2 / 3" : "5 / 6";

  return (
    <div
      ref={containerRef}
      className={`w-full ${phase === "exiting" ? "animate-combo-exit" : "animate-combo-enter"}`}
    >
      <div className="w-full max-w-[420px] md:max-w-[720px] mx-auto flex flex-col items-center gap-2 px-2">
        {rows.map((rowIndices, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-center gap-1.5 w-full">
            {rowIndices.map((punchIdx, posInRow) => (
              <Fragment key={punchIdx}>
                {posInRow > 0 && <Connector index={punchIdx} phase={phase} />}
                <div
                  className="flex-1 min-w-0"
                  style={{
                    maxWidth: "160px",
                    aspectRatio: cardAspect,
                  }}
                >
                  <PunchCard
                    punch={punches[punchIdx]}
                    index={punchIdx}
                    phase={phase}
                    compact={compact}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ComboCallout Component ───

export function ComboCallout({
  state,
}: {
  state: CalloutState;
}) {
  if (state.phase === "idle") {
    return <ComboIdle />;
  }

  return <ActiveCombo state={state} />;
}

// ─── Pacing Selector ───

const PACING_OPTIONS: { value: CalloutPacing; label: string; desc: string }[] = [
  { value: "slow", label: "Slow", desc: "More time per combo" },
  { value: "medium", label: "Medium", desc: "Balanced pace" },
  { value: "fast", label: "Fast", desc: "Less time per combo" },
  { value: "progressive", label: "Progressive", desc: "Speeds up" },
];

export function CalloutPacingSelector({
  settings,
  onUpdate,
  extraSettings,
  defaultExpanded = false,
}: {
  settings: CalloutSettings;
  onUpdate: (partial: Partial<CalloutSettings>) => void;
  extraSettings?: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const audioAvailable = isAudioAvailable();
  const [showMore, setShowMore] = useState(defaultExpanded);

  return (
    <div className="space-y-3">
      {/* Pacing grid */}
      <div>
        <p className="text-xs text-muted uppercase tracking-wider mb-2 font-medium">
          Combo Pacing
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PACING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ pacing: opt.value })}
              className={`card-glass rounded-xl px-3 py-2.5 text-left transition-all ${
                settings.pacing === opt.value
                  ? "!border-accent/40 animate-preset-glow"
                  : ""
              }`}
            >
              <span
                className={`text-sm font-bold block ${
                  settings.pacing === opt.value ? "text-accent" : "text-foreground"
                }`}
              >
                {opt.label}
              </span>
              <span className="text-[10px] text-muted">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio toggle */}
      <div className="flex items-center justify-between card-glass rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          {settings.audioEnabled ? (
            <Volume2 className="w-4 h-4 text-accent" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted" />
          )}
          <span className="text-sm font-medium">Voice Callouts</span>
        </div>
        <button
          onClick={() =>
            audioAvailable && onUpdate({ audioEnabled: !settings.audioEnabled })
          }
          disabled={!audioAvailable}
          className={`w-11 h-6 rounded-full relative transition-colors ${
            !audioAvailable
              ? "bg-border opacity-50 cursor-not-allowed"
              : settings.audioEnabled
                ? "bg-accent"
                : "bg-border"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              settings.audioEnabled ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* More settings toggle - hidden when already expanded */}
      {!defaultExpanded && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center justify-center gap-1 w-full py-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <span>{showMore ? "Less" : "More Settings"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Collapsible settings */}
      {showMore && (
        <div className="space-y-3 animate-fade-in-up">
          {/* Voice mode */}
          {settings.audioEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Voice Mode</span>
              <div className="flex gap-1.5">
                {([
                  { value: "names" as const, label: "Names" },
                  { value: "numbers" as const, label: "Numbers" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ audioMode: opt.value })}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                      settings.audioMode === opt.value
                        ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                        : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Combo order */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Combo Order</span>
            <div className="flex gap-1.5">
              {([
                { value: "sequential" as const, label: "In Order" },
                { value: "random" as const, label: "Random" },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ comboOrder: opt.value })}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                    (settings.comboOrder ?? "random") === opt.value
                      ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                      : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {extraSettings}
        </div>
      )}
    </div>
  );
}
