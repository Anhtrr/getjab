"use client";

import { Smile, ThumbsUp, Flame, Skull } from "lucide-react";
import { ReactNode } from "react";

interface PostWorkoutRatingProps {
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  onSkip: () => void;
}

const ratings: { value: 1 | 2 | 3 | 4; label: string; icon: ReactNode }[] = [
  { value: 1, label: "Easy", icon: <Smile className="w-7 h-7" /> },
  { value: 2, label: "Just Right", icon: <ThumbsUp className="w-7 h-7" /> },
  { value: 3, label: "Tough", icon: <Flame className="w-7 h-7" /> },
  { value: 4, label: "Destroyed Me", icon: <Skull className="w-7 h-7" /> },
];

export default function PostWorkoutRating({
  onRate,
  onSkip,
}: PostWorkoutRatingProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] px-4 animate-modal-overlay">
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full animate-modal-content">
        <h2 className="text-xl font-bold text-center mb-1">
          How did that feel?
        </h2>
        <p className="text-muted text-sm text-center mb-6">
          Rate your workout to track your progress
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {ratings.map((r) => (
            <button
              key={r.value}
              onClick={() => onRate(r.value)}
              className="bg-background border border-border rounded-xl p-4 text-center hover:border-[#00e5ff]/30 hover:shadow-[0_0_12px_rgba(0,229,255,0.12)] transition-all active:scale-95"
            >
              <span className="block mb-1 flex justify-center">{r.icon}</span>
              <span className="text-sm font-medium">{r.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="w-full text-muted text-sm py-2 hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
