"use client";

import { useRef, useEffect, useMemo, useState } from "react";

interface ProgressCalendarProps {
  workoutDates: Record<string, number>;
}

const INTENSITY = [
  "bg-border/30",
  "bg-[#00e5ff]/25",
  "bg-[#00e5ff]/50",
  "bg-[#00e5ff]/80",
];

const CELL = 11;
const GAP = 3;
const COL_WIDTH = CELL + GAP;

export default function ProgressCalendar({
  workoutDates,
}: ProgressCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numWeeks, setNumWeeks] = useState(0);

  // Measure container and calculate how many columns fit exactly
  useEffect(() => {
    if (!containerRef.current) return;
    const cardPadding = 32; // p-4 = 16px each side
    const available = containerRef.current.offsetWidth - cardPadding;
    const cols = Math.floor((available + GAP) / COL_WIDTH);
    setNumWeeks(cols);
  }, []);

  const weekColumns = useMemo(() => {
    if (numWeeks === 0) return [];

    const today = new Date();

    // End on today so recent workouts always appear.
    // Start from the Sunday of the current week, then go back numWeeks-1 full weeks.
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());

    const startSunday = new Date(currentWeekSunday);
    startSunday.setDate(startSunday.getDate() - (numWeeks - 1) * 7);

    type DayCell = { date: string; count: number };
    const days: DayCell[] = [];

    const d = new Date(startSunday);
    while (d <= today) {
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        count: workoutDates[dateStr] || 0,
      });
      d.setDate(d.getDate() + 1);
    }

    // Group into weeks (last column may be partial)
    const cols: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }

    return cols;
  }, [workoutDates, numWeeks]);

  const getColor = (count: number) => {
    if (count === 0) return INTENSITY[0];
    if (count === 1) return INTENSITY[1];
    if (count === 2) return INTENSITY[2];
    return INTENSITY[3];
  };

  return (
    <div className="card-glass rounded-2xl p-4" ref={containerRef}>
      <h3 className="text-sm font-medium mb-3 text-muted uppercase tracking-wider">
        Activity
      </h3>

      {numWeeks > 0 && (
        <div className="flex gap-[3px]">
          {weekColumns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-[11px] h-[11px] rounded-[2px] ${getColor(day.count)}`}
                  title={`${day.date}: ${day.count} workout${day.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[9px] text-muted mr-1">Less</span>
        {INTENSITY.map((color, i) => (
          <div key={i} className={`w-[9px] h-[9px] rounded-[2px] ${color}`} />
        ))}
        <span className="text-[9px] text-muted ml-1">More</span>
      </div>
    </div>
  );
}
