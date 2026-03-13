"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { workouts } from "@/data/workouts";
import { useProgress } from "@/hooks/useProgress";
import WorkoutCard from "@/components/WorkoutCard";
import { Search } from "lucide-react";

const levels = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const goals = [
  { value: "all", label: "All Goals" },
  { value: "technique", label: "Technique" },
  { value: "power", label: "Power" },
  { value: "conditioning", label: "Conditioning" },
  { value: "speed", label: "Speed" },
  { value: "general", label: "General" },
];

const FILTER_KEY = "jab_workout_filters";

function loadFilters(): { level: string; goal: string } {
  try {
    const raw = sessionStorage.getItem(FILTER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { level: "all", goal: "all" };
}

function saveFilters(level: string, goal: string) {
  try {
    sessionStorage.setItem(FILTER_KEY, JSON.stringify({ level, goal }));
  } catch {}
}

export default function WorkoutsPage() {
  const saved = loadFilters();
  const [levelFilter, setLevelFilter] = useState(saved.level);
  const [goalFilter, setGoalFilter] = useState(saved.goal);
  const { logs } = useProgress();

  const completionMap = useMemo(() => {
    const map: Record<string, { count: number; lastAt: string | null }> = {};
    for (const log of logs) {
      if (!map[log.workoutId]) {
        map[log.workoutId] = { count: 0, lastAt: null };
      }
      map[log.workoutId].count++;
      const logDate = log.completedAt || log.date;
      if (!map[log.workoutId].lastAt || logDate > map[log.workoutId].lastAt!) {
        map[log.workoutId].lastAt = logDate;
      }
    }
    return map;
  }, [logs]);

  useEffect(() => {
    saveFilters(levelFilter, goalFilter);
  }, [levelFilter, goalFilter]);

  const filtered = workouts.filter((w) => {
    if (levelFilter !== "all" && w.level !== levelFilter) return false;
    if (goalFilter !== "all" && w.goal !== goalFilter) return false;
    return true;
  });

  return (
    <div className="px-4 pt-8 pb-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Workouts</h1>

      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevelFilter(l.value)}
              className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                levelFilter === l.value
                  ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  : "bg-surface border border-border text-muted hover:text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#00e5ff]/20"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoalFilter(g.value)}
              className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                goalFilter === g.value
                  ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  : "bg-surface border border-border text-muted hover:text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#00e5ff]/20"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 stagger-children">
        {filtered.map((workout) => (
          <div key={workout.id} className="animate-fade-in-up">
            <WorkoutCard
              workout={workout}
              completionInfo={completionMap[workout.id]
                ? {
                    completionCount: completionMap[workout.id].count,
                    lastCompletedAt: completionMap[workout.id].lastAt,
                  }
                : undefined
              }
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Search className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-muted">No workouts match your filters.</p>
            <p className="text-muted text-sm mt-1">Try adjusting your filters above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
