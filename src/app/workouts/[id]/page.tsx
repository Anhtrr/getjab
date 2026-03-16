"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getWorkout } from "@/data/workouts";
import { useCustomWorkouts } from "@/hooks/useCustomWorkouts";
import { useAudio } from "@/hooks/useAudio";
import { initComboAudio } from "@/lib/comboAudio";
import WorkoutStartButton from "@/components/WorkoutStartButton";
import { CalloutPacingSelector } from "@/components/ComboCallout";
import { Capacitor } from "@capacitor/core";
import type { RoundType, CalloutSettings } from "@/lib/types";
import { Pencil, Trash2, Settings2 } from "lucide-react";

const roundTypeColors: Record<RoundType, string> = {
  warmup: "text-yellow-400 bg-yellow-400/10",
  technique: "text-blue-400 bg-blue-400/10",
  bagwork: "text-red-400 bg-red-400/10",
  conditioning: "text-orange-400 bg-orange-400/10",
  cooldown: "text-green-400 bg-green-400/10",
};

const levelColors = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

function loadCalloutSettings(): CalloutSettings {
  try {
    const stored = localStorage.getItem("jab_callout_settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return { pacing: "medium", audioEnabled: true, audioMode: "names", comboOrder: "random", ...parsed };
    }
  } catch {}
  return { pacing: "medium", audioEnabled: true, audioMode: "names", comboOrder: "random" };
}

function saveCalloutSettings(settings: CalloutSettings): void {
  try { localStorage.setItem("jab_callout_settings", JSON.stringify(settings)); } catch {}
}

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const audio = useAudio();
  const { remove } = useCustomWorkouts();
  const id = params.id as string;
  const workout = getWorkout(id);

  const [showSettings, setShowSettings] = useState(false);
  const [calloutSettings, setCalloutSettings] = useState<CalloutSettings>(loadCalloutSettings);
  const [prepTimeSec, setPrepTimeSec] = useState(() => {
    try {
      const raw = localStorage.getItem("jab_timer_settings");
      if (raw) { const p = JSON.parse(raw); if (typeof p.prepTimeSec === "number") return p.prepTimeSec; }
    } catch {}
    return 10;
  });
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    try {
      const raw = localStorage.getItem("jab_timer_settings");
      if (raw) { const p = JSON.parse(raw); if (typeof p.hapticEnabled === "boolean") return p.hapticEnabled; }
    } catch {}
    return Capacitor.isNativePlatform();
  });

  const saveSetting = useCallback((key: string, value: unknown) => {
    try {
      const raw = localStorage.getItem("jab_timer_settings");
      const settings = raw ? JSON.parse(raw) : {};
      settings[key] = value;
      localStorage.setItem("jab_timer_settings", JSON.stringify(settings));
    } catch {}
  }, []);

  const updateCalloutSettings = useCallback((partial: Partial<CalloutSettings>) => {
    setCalloutSettings((prev) => {
      const next = { ...prev, ...partial };
      saveCalloutSettings(next);
      return next;
    });
  }, []);

  const handleStart = useCallback(() => {
    audio.init();
    initComboAudio();
    sessionStorage.setItem("jab_autostart", "true");
    router.push(`/workouts/${id}/go`);
  }, [audio, router, id]);

  if (!workout) {
    return (
      <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto text-center">
        <p className="text-muted mb-4">Workout not found.</p>
        <Link href="/workouts" className="text-[#00e5ff] hover:underline">
          Back to workouts
        </Link>
      </div>
    );
  }

  const isCustom = id.startsWith("custom-");

  const totalDuration = workout.rounds.reduce(
    (sum, r) => sum + r.durationSec + r.restSec,
    0,
  );

  function handleDelete() {
    if (window.confirm("Delete this workout? This can't be undone.")) {
      remove(id);
      router.push("/workouts");
    }
  }

  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <Link
        href="/workouts"
        className="text-muted text-sm hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to workouts
      </Link>

      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">{workout.title}</h1>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {isCustom && (
              <>
                <Link
                  href={`/workouts/edit/${id}`}
                  className="text-muted hover:text-[#00e5ff] transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-muted mt-1">{workout.description}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <span className={`text-sm font-medium ${levelColors[workout.level]}`}>
          {workout.level}
        </span>
        <span className="text-sm text-muted">
          {Math.round(totalDuration / 60)} min
        </span>
        <span className="text-sm text-muted">
          {workout.rounds.length} rounds
        </span>
        {workout.equipment.length > 0 && (
          <span className="text-sm text-muted">
            {workout.equipment.join(", ")}
          </span>
        )}
      </div>

      <div className="space-y-3 pb-24 stagger-children">
        {workout.rounds.map((round, i) => (
          <div
            key={i}
            className="card-glass rounded-xl p-4 hover:border-[#00e5ff]/20 transition-colors animate-fade-in-up"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted font-mono">
                  R{i + 1}
                </span>
                <span className="font-medium">{round.title}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${roundTypeColors[round.type]}`}
              >
                {round.type}
              </span>
            </div>
            <p className="text-sm text-muted mt-1">{round.instructions}</p>
            {round.combos && round.combos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {round.combos.map((combo, j) => (
                  <span
                    key={j}
                    className="text-xs font-mono bg-border/50 text-foreground px-2 py-0.5 rounded"
                  >
                    {combo}
                  </span>
                ))}
              </div>
            )}
            <div className="text-xs text-muted mt-2">
              {Math.floor(round.durationSec / 60)}:
              {(round.durationSec % 60).toString().padStart(2, "0")}
              {round.restSec > 0 && ` + ${round.restSec}s rest`}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed left-0 right-0 z-40 px-4 pb-3" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 3.5rem)" }}>
        <div className="max-w-lg md:max-w-2xl mx-auto flex gap-3">
          <WorkoutStartButton onClick={handleStart} />
          <button
            onClick={() => setShowSettings(true)}
            className="shrink-0 w-14 rounded-full flex items-center justify-center transition-all btn-secondary border border-border text-muted"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-modal-overlay">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative z-10 w-full max-w-lg md:max-w-2xl bg-surface rounded-t-3xl p-6 pb-10 animate-slide-in-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Workout Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-muted hover:text-foreground transition-colors p-1"
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            <CalloutPacingSelector
              settings={calloutSettings}
              onUpdate={updateCalloutSettings}
              defaultExpanded
              extraSettings={
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Get Ready</span>
                    <div className="flex gap-1.5">
                      {[{ value: 0, label: "Off" }, { value: 5, label: "5s" }, { value: 10, label: "10s" }, { value: 15, label: "15s" }].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setPrepTimeSec(opt.value); saveSetting("prepTimeSec", opt.value); }}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                            prepTimeSec === opt.value
                              ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                              : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(Capacitor.isNativePlatform() || (typeof navigator !== "undefined" && "vibrate" in navigator)) && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Haptic</span>
                      <div className="flex gap-1.5">
                        {[{ value: false, label: "Off" }, { value: true, label: "On" }].map((opt) => (
                          <button
                            key={String(opt.value)}
                            onClick={() => { setHapticEnabled(opt.value); saveSetting("hapticEnabled", opt.value); }}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                              hapticEnabled === opt.value
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
                </>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
