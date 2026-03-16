"use client";

import { useState } from "react";
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

// ─── Adaptive card sizing ───

interface CardSize {
  w: string;
  h: string;
  numText: string;
  nameText: string;
}

function getCardSize(punchCount: number): CardSize {
  if (punchCount <= 2) return { w: "w-[140px]", h: "h-[160px]", numText: "text-5xl", nameText: "text-sm" };
  if (punchCount === 3) return { w: "w-[120px]", h: "h-[140px]", numText: "text-5xl", nameText: "text-xs" };
  if (punchCount === 4) return { w: "w-[100px]", h: "h-[120px]", numText: "text-4xl", nameText: "text-xs" };
  return { w: "w-[88px]", h: "h-[108px]", numText: "text-3xl", nameText: "text-[10px]" };
}

// ─── Punch Card ───

function PunchCard({
  punch,
  index,
  phase,
  size,
}: {
  punch: ParsedPunch;
  index: number;
  phase: string;
  size: CardSize;
}) {
  const colors = PUNCH_COLORS[punch.type] || PUNCH_COLORS.straight;
  const isActive = phase === "entering" || phase === "holding";

  return (
    <div
      className={`
        flex flex-col items-center justify-center rounded-xl
        ${size.w} ${size.h}
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
          typeof punch.number === "string" ? size.nameText : size.numText
        }`}
        style={{ color: colors.text }}
      >
        {punch.number}
      </span>
      <span
        className={`font-bold uppercase tracking-wider mt-1 ${size.nameText}`}
        style={{ color: colors.text, opacity: 0.8 }}
      >
        {punch.shortName}
      </span>
      {punch.target === "body" && (
        <span className="text-[9px] font-bold uppercase text-amber-400 mt-0.5">
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
      className={`w-4 h-1 rounded-full ${
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

function ActiveCombo({
  state,
}: {
  state: CalloutState;
}) {
  const { activeCombo, phase } = state;

  if (!activeCombo) return null;

  const size = getCardSize(activeCombo.punches.length);

  return (
    <div
      className={`py-4 ${phase === "exiting" ? "animate-combo-exit" : "animate-combo-enter"}`}
    >
      <div
        className="flex items-center justify-center gap-1.5 flex-wrap"
        style={{
          maxWidth: activeCombo.punches.length > 4
            ? `${3 * 96 + 3 * 20}px`
            : undefined,
        }}
      >
        {activeCombo.punches.map((punch, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <Connector index={i} phase={phase} />}
            <PunchCard
              punch={punch}
              index={i}
              phase={phase}
              size={size}
            />
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
}: {
  settings: CalloutSettings;
  onUpdate: (partial: Partial<CalloutSettings>) => void;
  extraSettings?: React.ReactNode;
}) {
  const audioAvailable = isAudioAvailable();
  const [showMore, setShowMore] = useState(false);

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
                  ? "!border-accent !shadow-[0_0_12px_rgba(0,229,255,0.15)]"
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

      {/* More settings toggle */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="flex items-center justify-center gap-1 w-full py-1.5 text-xs text-muted hover:text-foreground transition-colors"
      >
        <span>{showMore ? "Less" : "More Settings"}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} />
      </button>

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
