"use client";

import { useState } from "react";
import type { Round, RoundType } from "@/lib/types";
import { X, Plus, Minus, Check, RotateCcw, Type } from "lucide-react";

const roundTypes: { value: RoundType; label: string }[] = [
  { value: "warmup", label: "Warmup" },
  { value: "technique", label: "Technique" },
  { value: "bagwork", label: "Bagwork" },
  { value: "conditioning", label: "Conditioning" },
  { value: "cooldown", label: "Cooldown" },
];

// ─── Punch Registry (mirrors comboParser.ts) ───

const PUNCHES = [
  { number: 1, name: "Jab", shortName: "JAB", type: "straight" },
  { number: 2, name: "Cross", shortName: "CROSS", type: "straight" },
  { number: 3, name: "Lead Hook", shortName: "HOOK", type: "hook" },
  { number: 4, name: "Rear Hook", shortName: "HOOK", type: "hook" },
  { number: 5, name: "Lead Upper", shortName: "UPPER", type: "uppercut" },
  { number: 6, name: "Rear Upper", shortName: "UPPER", type: "uppercut" },
] as const;

const DEFENSE_MOVES = [
  { token: "SL", name: "Slip Left", shortName: "SLIP", type: "defense" },
  { token: "SR", name: "Slip Right", shortName: "SLIP", type: "defense" },
  { token: "RL", name: "Roll Left", shortName: "ROLL", type: "defense" },
  { token: "RR", name: "Roll Right", shortName: "ROLL", type: "defense" },
  { token: "PL", name: "Parry Left", shortName: "PARRY", type: "defense" },
  { token: "PR", name: "Parry Right", shortName: "PARRY", type: "defense" },
] as const;

const PUNCH_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  straight: { text: "#00e5ff", bg: "rgba(0, 229, 255, 0.1)", border: "rgba(0, 229, 255, 0.3)" },
  hook: { text: "#ff6b35", bg: "rgba(255, 107, 53, 0.1)", border: "rgba(255, 107, 53, 0.3)" },
  uppercut: { text: "#a855f7", bg: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.3)" },
  defense: { text: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)" },
};

interface BuilderPunch {
  number: number | string;
  name: string;
  type: string;
  target?: "body";
}

function formatComboString(punches: BuilderPunch[]): string {
  const tokens = punches
    .map((p) => (p.target === "body" ? `${p.number}-body` : String(p.number)))
    .join("-");
  const names = punches
    .map((p) => (p.target === "body" ? `Body ${p.name}` : p.name))
    .join("-");
  return `${tokens} (${names})`;
}

// ─── Combo Builder Sub-component ───

const MAX_COMBO_LENGTH = 8;

function ComboBuilder({ onAdd }: { onAdd: (combo: string) => void }) {
  const [sequence, setSequence] = useState<BuilderPunch[]>([]);
  const atLimit = sequence.length >= MAX_COMBO_LENGTH;

  function addPunch(punch: (typeof PUNCHES)[number]) {
    if (atLimit) return;
    setSequence([...sequence, { number: punch.number, name: punch.name, type: punch.type }]);
  }

  function addDefense(move: (typeof DEFENSE_MOVES)[number]) {
    if (atLimit) return;
    setSequence([...sequence, { number: move.token, name: move.name, type: move.type }]);
  }

  function toggleBody(index: number) {
    // Only allow body toggle on punches, not defense moves
    if (typeof sequence[index]?.number === "string") return;
    setSequence(
      sequence.map((p, i) =>
        i === index ? { ...p, target: p.target === "body" ? undefined : "body" } : p,
      ),
    );
  }

  function removeLast() {
    setSequence(sequence.slice(0, -1));
  }

  function confirm() {
    if (sequence.length === 0) return;
    onAdd(formatComboString(sequence));
    setSequence([]);
  }

  return (
    <div className="space-y-3">
      {/* Punch buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {PUNCHES.map((punch) => {
          const colors = PUNCH_COLORS[punch.type];
          return (
            <button
              key={punch.number}
              onClick={() => addPunch(punch)}
              disabled={atLimit}
              className={`flex flex-col items-center py-2.5 rounded-xl transition-all active:scale-95 ${atLimit ? "opacity-30 cursor-not-allowed" : ""}`}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <span
                className="font-mono text-lg font-black leading-none"
                style={{ color: colors.text }}
              >
                {punch.number}
              </span>
              <span
                className="text-[9px] font-bold uppercase mt-0.5"
                style={{ color: colors.text, opacity: 0.7 }}
              >
                {punch.shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Defense buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {DEFENSE_MOVES.map((move) => {
          const colors = PUNCH_COLORS.defense;
          return (
            <button
              key={move.token}
              onClick={() => addDefense(move)}
              disabled={atLimit}
              className={`flex flex-col items-center py-2 rounded-xl transition-all active:scale-95 ${atLimit ? "opacity-30 cursor-not-allowed" : ""}`}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <span
                className="font-mono text-xs font-black leading-none"
                style={{ color: colors.text }}
              >
                {move.token}
              </span>
              <span
                className="text-[8px] font-bold uppercase mt-0.5"
                style={{ color: colors.text, opacity: 0.7 }}
              >
                {move.shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live preview */}
      {sequence.length > 0 && (
        <div className="bg-background border border-border rounded-xl p-3">
          <div className="flex items-center gap-1 flex-wrap mb-2">
            {sequence.map((punch, i) => {
              const colors = PUNCH_COLORS[punch.type];
              return (
                <div key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted text-xs">-</span>}
                  <button
                    onClick={() => toggleBody(i)}
                    className="flex flex-col items-center rounded-lg px-2 py-1 transition-all"
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                    }}
                    title="Tap to toggle body shot"
                  >
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: colors.text }}
                    >
                      {punch.number}
                    </span>
                    {punch.target === "body" && (
                      <span className="text-[7px] font-bold text-amber-400 -mt-0.5">
                        BODY
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted truncate">
            {formatComboString(sequence)}
          </p>
          <p className="text-[9px] text-muted/60 mt-0.5">
            Tap a punch to toggle body shot
          </p>
        </div>
      )}

      {/* Builder actions */}
      <div className="flex gap-2">
        <button
          onClick={confirm}
          disabled={sequence.length === 0}
          className="flex-1 btn-primary py-2 rounded-full text-sm flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Check className="w-3.5 h-3.5" />
          Add Combo
        </button>
        <button
          onClick={removeLast}
          disabled={sequence.length === 0}
          className="btn-secondary border border-border px-3 py-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo last punch"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main RoundEditor ───

interface RoundEditorProps {
  initialRound?: Round;
  onSave: (round: Round) => void;
  onCancel: () => void;
}

export default function RoundEditor({
  initialRound,
  onSave,
  onCancel,
}: RoundEditorProps) {
  const [title, setTitle] = useState(initialRound?.title ?? "");
  const [type, setType] = useState<RoundType>(initialRound?.type ?? "bagwork");
  const [durationSec, setDurationSec] = useState(
    initialRound?.durationSec ?? 180,
  );
  const [restSec, setRestSec] = useState(initialRound?.restSec ?? 60);
  const [instructions, setInstructions] = useState(
    initialRound?.instructions ?? "",
  );
  const [combos, setCombos] = useState<string[]>(initialRound?.combos ?? []);
  const [showFreestyleInput, setShowFreestyleInput] = useState(false);
  const [freestyleText, setFreestyleText] = useState("");

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      type,
      durationSec,
      restSec,
      title: title.trim(),
      instructions: instructions.trim(),
      ...(combos.filter((c) => c.trim()).length > 0
        ? { combos: combos.filter((c) => c.trim()) }
        : {}),
    });
  }

  function addFreestyle() {
    if (!freestyleText.trim()) return;
    setCombos([...combos, freestyleText.trim()]);
    setFreestyleText("");
    setShowFreestyleInput(false);
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="card-glass rounded-2xl p-5 space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">
          {initialRound ? "Edit Round" : "New Round"}
        </h3>
        <button
          onClick={onCancel}
          className="text-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="text-sm text-muted mb-1 block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Power Jab-Cross"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-[#00e5ff]/30 focus:outline-none transition-colors"
        />
      </div>

      {/* Type */}
      <div>
        <label className="text-sm text-muted mb-2 block">Type</label>
        <div className="flex gap-2 flex-wrap">
          {roundTypes.map((rt) => (
            <button
              key={rt.value}
              onClick={() => setType(rt.value)}
              className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                type === rt.value
                  ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
              }`}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-sm text-muted mb-2 block">
          Duration: {formatTime(durationSec)}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDurationSec(Math.max(10, durationSec - 10))}
            className="btn-secondary border border-border w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 bg-border/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#00e5ff] to-[#0090ff] h-2 rounded-full transition-all"
              style={{ width: `${Math.min((durationSec / 600) * 100, 100)}%` }}
            />
          </div>
          <button
            onClick={() => setDurationSec(durationSec + 10)}
            className="btn-secondary border border-border w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rest */}
      <div>
        <label className="text-sm text-muted mb-2 block">
          Rest: {formatTime(restSec)}
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRestSec(Math.max(0, restSec - 5))}
            className="btn-secondary border border-border w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 bg-border/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#00e5ff] to-[#0090ff] h-2 rounded-full transition-all"
              style={{ width: `${Math.min((restSec / 300) * 100, 100)}%` }}
            />
          </div>
          <button
            onClick={() => setRestSec(restSec + 5)}
            className="btn-secondary border border-border w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="text-sm text-muted mb-1 block">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Describe what to do during this round..."
          rows={3}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-[#00e5ff]/30 focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Combos */}
      <div>
        <label className="text-sm text-muted mb-2 block">
          Combos (optional)
        </label>

        {/* Existing combos list */}
        {combos.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {combos.map((combo, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2"
              >
                <span className="flex-1 text-sm font-mono truncate">
                  {combo}
                </span>
                <button
                  onClick={() => setCombos(combos.filter((_, j) => j !== i))}
                  className="text-muted hover:text-red-400 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Visual combo builder */}
        <ComboBuilder onAdd={(combo) => setCombos([...combos, combo])} />

        {/* Freestyle text option */}
        <div className="mt-3">
          {showFreestyleInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={freestyleText}
                onChange={(e) => setFreestyleText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFreestyle()}
                placeholder="e.g. All punches - max speed"
                autoFocus
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:border-[#00e5ff]/30 focus:outline-none transition-colors"
              />
              <button
                onClick={addFreestyle}
                disabled={!freestyleText.trim()}
                className="btn-primary px-3 py-2 rounded-xl text-sm disabled:opacity-30"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowFreestyleInput(false);
                  setFreestyleText("");
                }}
                className="text-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowFreestyleInput(true)}
              className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Type className="w-3.5 h-3.5" />
              Add freestyle instruction
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="flex-1 btn-primary py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {initialRound ? "Update Round" : "Add Round"}
        </button>
        <button
          onClick={onCancel}
          className="btn-secondary border border-border py-3 px-6 rounded-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
