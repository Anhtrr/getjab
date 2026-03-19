"use client";

import { useRef, useEffect, useMemo, useState } from "react";

interface ActivityGridProps {
  workoutDates: Record<string, number>;
  workoutMinutes?: Record<string, number>;
}

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

function getIntensity(count: number, minutes: number): number {
  if (count === 0) return 0;
  // Combine count and minutes for richer intensity
  const score = count + Math.floor(minutes / 15);
  if (score <= 1) return 1;
  if (score <= 2) return 2;
  if (score <= 4) return 3;
  return 4;
}

export default function ActivityGrid({
  workoutDates,
  workoutMinutes,
}: ActivityGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numWeeks, setNumWeeks] = useState(0);

  // Measure container and recalculate on resize
  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const cardPadding = 32;
      const available = containerRef.current.offsetWidth - cardPadding;
      const cols = Math.floor((available + GAP) / COL_WIDTH);
      setNumWeeks(cols);
    }

    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const weekColumns = useMemo(() => {
    if (numWeeks === 0) return [];

    const today = new Date();

    // End on today, start from the Sunday of the current week going back
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());

    const startSunday = new Date(currentWeekSunday);
    startSunday.setDate(startSunday.getDate() - (numWeeks - 1) * 7);

    type DayCell = { date: string; count: number; minutes: number; intensity: number };
    const days: DayCell[] = [];

    const d = new Date(startSunday);
    while (d <= today) {
      const dateStr = d.toISOString().split("T")[0];
      const count = workoutDates[dateStr] || 0;
      const minutes = workoutMinutes?.[dateStr] || 0;
      days.push({
        date: dateStr,
        count,
        minutes,
        intensity: getIntensity(count, minutes),
      });
      d.setDate(d.getDate() + 1);
    }

    // Group into weeks (last column may be partial)
    const cols: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }

    return cols;
  }, [workoutDates, workoutMinutes, numWeeks]);

  return (
    <div className="card-glass rounded-2xl p-4" ref={containerRef}>
      {numWeeks > 0 && (
        <div className="flex gap-[3px]">
          {weekColumns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-[11px] h-[11px] rounded-[2px] transition-colors ${INTENSITY_COLORS[day.intensity]}`}
                  title={`${day.date}: ${day.count} workout${day.count !== 1 ? "s" : ""}${day.minutes > 0 ? `, ${day.minutes} min` : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[9px] text-muted mr-1">Less</span>
        {INTENSITY_COLORS.map((color, i) => (
          <div key={i} className={`w-[9px] h-[9px] rounded-[2px] ${color}`} />
        ))}
        <span className="text-[9px] text-muted ml-1">More</span>
      </div>
    </div>
  );
}
