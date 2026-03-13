"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import type { HeatmapDay } from "@/lib/gamification/types";

const INTENSITY_COLORS = [
  "bg-border/30",
  "bg-[#00e5ff]/20",
  "bg-[#00e5ff]/40",
  "bg-[#00e5ff]/65",
  "bg-[#00e5ff] shadow-[0_0_4px_rgba(0,229,255,0.3)]",
];

const CELL = 11;
const GAP = 3;
const COL_WIDTH = CELL + GAP;

interface TrainingHeatmapProps {
  days: HeatmapDay[];
}

export default function TrainingHeatmap({ days }: TrainingHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numWeeks, setNumWeeks] = useState(0);

  // Measure container and calculate how many columns fit
  useEffect(() => {
    if (!containerRef.current) return;
    const cardPadding = 32; // p-4 = 16px each side
    const available = containerRef.current.offsetWidth - cardPadding;
    const cols = Math.floor((available + GAP) / COL_WIDTH);
    setNumWeeks(cols);
  }, []);

  const weeks = useMemo(() => {
    if (numWeeks === 0 || days.length === 0) return [];

    // Group all days into week columns
    const allWeeks: HeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      allWeeks.push(days.slice(i, i + 7));
    }

    // Take only the last numWeeks columns
    return allWeeks.slice(-numWeeks);
  }, [days, numWeeks]);

  return (
    <div ref={containerRef}>
      <h3 className="font-bold text-lg mb-3">Training Activity</h3>
      <div className="card-glass rounded-2xl p-4">
        {numWeeks > 0 && (
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`w-[11px] h-[11px] rounded-[2px] transition-colors ${INTENSITY_COLORS[day.intensity]}`}
                    title={`${day.date}: ${day.count} workout${day.count !== 1 ? "s" : ""}, ${day.totalMinutes} min`}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-[9px] text-muted mr-1">Less</span>
          {INTENSITY_COLORS.map((color, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${color}`} />
          ))}
          <span className="text-[9px] text-muted ml-1">More</span>
        </div>
      </div>
    </div>
  );
}
