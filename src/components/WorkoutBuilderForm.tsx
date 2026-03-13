"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Workout, Round, Level, Goal, RoundType } from "@/lib/types";
import { generateCustomId } from "@/lib/customWorkouts";
import { useCustomWorkouts } from "@/hooks/useCustomWorkouts";
import RoundEditor from "./RoundEditor";
import RoundPicker from "./RoundPicker";
import { X, Plus, GripVertical, BookOpen } from "lucide-react";

const levelOptions: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const goalOptions: { value: Goal; label: string }[] = [
  { value: "technique", label: "Technique" },
  { value: "power", label: "Power" },
  { value: "conditioning", label: "Conditioning" },
  { value: "speed", label: "Speed" },
  { value: "general", label: "General" },
];

const roundTypeColors: Record<RoundType, string> = {
  warmup: "text-yellow-400 bg-yellow-400/10",
  technique: "text-blue-400 bg-blue-400/10",
  bagwork: "text-red-400 bg-red-400/10",
  conditioning: "text-orange-400 bg-orange-400/10",
  cooldown: "text-green-400 bg-green-400/10",
};

interface WorkoutBuilderFormProps {
  initialWorkout?: Workout;
}

export default function WorkoutBuilderForm({
  initialWorkout,
}: WorkoutBuilderFormProps) {
  const router = useRouter();
  const { save } = useCustomWorkouts();

  const DRAFT_KEY = "jab_builder_draft";
  const restoredRef = useRef(false);

  const [title, setTitle] = useState(initialWorkout?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialWorkout?.subtitle ?? "");
  const [level, setLevel] = useState<Level>(
    initialWorkout?.level ?? "beginner",
  );
  const [goal, setGoal] = useState<Goal>(initialWorkout?.goal ?? "general");
  const [rounds, setRounds] = useState<Round[]>(initialWorkout?.rounds ?? []);
  const [showRoundEditor, setShowRoundEditor] = useState(false);
  const [showRoundPicker, setShowRoundPicker] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  // Restore draft on mount (only for new workouts, not edits)
  useEffect(() => {
    if (restoredRef.current || initialWorkout) return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.title) setTitle(draft.title);
      if (draft.subtitle) setSubtitle(draft.subtitle);
      if (draft.level) setLevel(draft.level);
      if (draft.goal) setGoal(draft.goal);
      if (draft.rounds?.length > 0) setRounds(draft.rounds);
      setDraftRestored(true);
      setTimeout(() => setDraftRestored(false), 3000);
    } catch {}
  }, [initialWorkout]);

  // Persist draft on every change
  useEffect(() => {
    if (initialWorkout) return;
    if (!restoredRef.current) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ title, subtitle, level, goal, rounds }));
    } catch {}
  }, [initialWorkout, title, subtitle, level, goal, rounds]);

  function handleAddCustomRound(round: Round) {
    setRounds([...rounds, round]);
    setShowRoundEditor(false);
  }

  function handlePickRound(round: Round) {
    setRounds([...rounds, round]);
    setShowRoundPicker(false);
  }

  function handleRemoveRound(index: number) {
    setRounds(rounds.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (!title.trim() || rounds.length === 0) return;

    const workout: Workout = {
      id: initialWorkout?.id ?? generateCustomId(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: subtitle.trim() || `Custom ${level} workout`,
      level,
      goal,
      durationMin: Math.round(
        rounds.reduce((s, r) => s + r.durationSec + r.restSec, 0) / 60,
      ),
      equipment: [],
      isFree: false,
      rounds,
    };

    save(workout);
    try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    router.push(`/workouts/${workout.id}`);
  }

  const totalDuration = rounds.reduce(
    (s, r) => s + r.durationSec + r.restSec,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Draft restored indicator */}
      {draftRestored && (
        <div className="text-center text-xs text-accent animate-fade-in-up">
          Draft restored
        </div>
      )}

      {/* Metadata */}
      <div className="card-glass rounded-2xl p-5 space-y-4 animate-fade-in-up">
        <div>
          <label className="text-sm text-muted mb-1 block">
            Workout Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My Power Session"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-[#00e5ff]/30 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-muted mb-1 block">Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Heavy bag power combos"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-[#00e5ff]/30 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-muted mb-2 block">Level</label>
          <div className="flex gap-2 flex-wrap">
            {levelOptions.map((l) => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  level === l.value
                    ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted mb-2 block">Goal</label>
          <div className="flex gap-2 flex-wrap">
            {goalOptions.map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  goal === g.value
                    ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rounds list */}
      <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">
            Rounds ({rounds.length})
          </h2>
          {rounds.length > 0 && (
            <span className="text-sm text-muted">
              {Math.round(totalDuration / 60)} min total
            </span>
          )}
        </div>

        {rounds.length === 0 && !showRoundEditor && (
          <div className="card-glass rounded-2xl p-8 text-center">
            <p className="text-muted mb-1">No rounds yet</p>
            <p className="text-sm text-muted">
              Add custom rounds or pick from the library below.
            </p>
          </div>
        )}

        <div className="space-y-2 stagger-children">
          {rounds.map((round, i) => (
            <div
              key={i}
              className="card-glass rounded-xl p-4 animate-fade-in-up"
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-muted mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted font-mono">
                        R{i + 1}
                      </span>
                      <span className="font-medium truncate">
                        {round.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${roundTypeColors[round.type]}`}
                    >
                      {round.type}
                    </span>
                  </div>
                  <div className="text-xs text-muted">
                    {Math.floor(round.durationSec / 60)}:
                    {(round.durationSec % 60).toString().padStart(2, "0")}
                    {round.restSec > 0 && ` + ${round.restSec}s rest`}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRound(i)}
                  className="text-muted hover:text-red-400 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Round editor inline */}
      {showRoundEditor && (
        <RoundEditor
          onSave={handleAddCustomRound}
          onCancel={() => setShowRoundEditor(false)}
        />
      )}

      {/* Add actions */}
      {!showRoundEditor && (
        <div
          className="flex gap-3 animate-fade-in-up"
          style={{ animationDelay: "120ms" }}
        >
          <button
            onClick={() => setShowRoundEditor(true)}
            className="flex-1 btn-secondary border border-border py-3 rounded-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Custom Round
          </button>
          <button
            onClick={() => setShowRoundPicker(true)}
            className="flex-1 btn-secondary border border-border py-3 rounded-full flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            From Library
          </button>
        </div>
      )}

      {/* Save button */}
      <div className="animate-fade-in-up" style={{ animationDelay: "180ms" }}>
        <button
          onClick={handleSave}
          disabled={!title.trim() || rounds.length === 0}
          className="w-full btn-primary text-lg py-4 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {initialWorkout ? "Save Changes" : "Create Workout"}
        </button>
      </div>

      {/* Round picker modal */}
      {showRoundPicker && (
        <RoundPicker
          onSelect={handlePickRound}
          onClose={() => setShowRoundPicker(false)}
        />
      )}
    </div>
  );
}
