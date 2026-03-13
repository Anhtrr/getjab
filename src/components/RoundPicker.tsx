"use client";

import { useState, useMemo } from "react";
import { workouts } from "@/data/workouts";
import type { Round, RoundType } from "@/lib/types";
import { X, Search } from "lucide-react";

const roundTypeFilters: { value: "all" | RoundType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "warmup", label: "Warmup" },
  { value: "technique", label: "Technique" },
  { value: "bagwork", label: "Bagwork" },
  { value: "conditioning", label: "Conditioning" },
  { value: "cooldown", label: "Cooldown" },
];

const roundTypeColors: Record<RoundType, string> = {
  warmup: "text-yellow-400 bg-yellow-400/10",
  technique: "text-blue-400 bg-blue-400/10",
  bagwork: "text-red-400 bg-red-400/10",
  conditioning: "text-orange-400 bg-orange-400/10",
  cooldown: "text-green-400 bg-green-400/10",
};

interface RoundPIckerProps {
  onSelect: (round: Round) => void;
  onClose: () => void;
}

export default function RoundPicker({ onSelect, onClose }: RoundPIckerProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | RoundType>("all");
  const [search, setSearch] = useState("");

  const groupedRounds = useMemo(() => {
    const groups: { workoutTitle: string; rounds: Round[] }[] = [];
    for (const workout of workouts) {
      const filtered = workout.rounds.filter((r) => {
        if (typeFilter !== "all" && r.type !== typeFilter) return false;
        if (
          search &&
          !r.title.toLowerCase().includes(search.toLowerCase()) &&
          !r.instructions.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      });
      if (filtered.length > 0) {
        groups.push({ workoutTitle: workout.title, rounds: filtered });
      }
    }
    return groups;
  }, [typeFilter, search]);

  function handleSelect(round: Round) {
    const copy: Round = JSON.parse(JSON.stringify(round));
    onSelect(copy);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 animate-modal-overlay">
      <div className="h-full flex flex-col bg-background animate-modal-content">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pick a Round</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rounds..."
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted/50 focus:border-[#00e5ff]/30 focus:outline-none transition-colors"
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {roundTypeFilters.map((rt) => (
              <button
                key={rt.value}
                onClick={() => setTypeFilter(rt.value)}
                className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                  typeFilter === rt.value
                    ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
                }`}
              >
                {rt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Round list */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {groupedRounds.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-muted">No rounds match your filters.</p>
            </div>
          )}

          <div className="space-y-6 stagger-children">
            {groupedRounds.map((group) => (
              <div key={group.workoutTitle} className="animate-fade-in-up">
                <h3 className="text-sm font-medium text-muted mb-2">
                  {group.workoutTitle}
                </h3>
                <div className="space-y-2">
                  {group.rounds.map((round, i) => (
                    <button
                      key={`${group.workoutTitle}-${i}`}
                      onClick={() => handleSelect(round)}
                      className="w-full text-left card-glass rounded-xl p-4 hover:border-[#00e5ff]/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{round.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${roundTypeColors[round.type]}`}
                        >
                          {round.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted line-clamp-2">
                        {round.instructions}
                      </p>
                      <div className="text-xs text-muted mt-2">
                        {Math.floor(round.durationSec / 60)}:
                        {(round.durationSec % 60).toString().padStart(2, "0")}
                        {round.restSec > 0 && ` + ${round.restSec}s rest`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
