"use client";

import type { StreakShieldState } from "@/lib/gamification/types";
import { Shield } from "lucide-react";

interface StreakShieldDisplayProps {
  shields: StreakShieldState;
}

export default function StreakShieldDisplay({ shields }: StreakShieldDisplayProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <Shield
          key={i}
          className={`w-4 h-4 transition-colors ${
            i < shields.shields
              ? "text-accent fill-accent/20"
              : "text-border"
          }`}
        />
      ))}
      <span className="text-[10px] text-muted ml-1">
        {shields.shields} shield{shields.shields !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
