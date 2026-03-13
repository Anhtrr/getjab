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

// No day labels — keeps the grid clean on mobile
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CELL = 11;
const GAP = 3;
const COL_WIDTH = CELL + GAP;
const DAY_LABEL_W = 0;

export default function ProgressCalendar({
  workoutDates,
}: ProgressCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numWeeks, setNumWeeks] = useState(0);

  // Measure container and calculate how many columns fit exactly
  useEffect(() => {
    if (!containerRef.current) return;
    const cardPadding = 32; // p-4 = 16px each side
    const available = containerRef.current.offsetWidth - cardPadding - DAY_LABEL_W;
    const cols = Math.floor((available + GAP) / COL_WIDTH);
    setNumWeeks(cols);
  }, []);

  const { weekColumns, monthRow } = useMemo(() => {
    if (numWeeks === 0) return { weekColumns: [], monthRow: [] };

    const today = new Date();

    // End on the most recent Saturday (last complete week boundary)
    // so every column is a full 7-day week — no ragged partial column
    const endSaturday = new Date(today);
    const todayDay = endSaturday.getDay(); // 0=Sun
    // If today is Sunday (0), last Saturday was yesterday (-1)
    // If today is Monday (1), last Saturday was 2 days ago (-2), etc.
    // If today is Saturday (6), use today (0)
    const daysBack = todayDay === 6 ? 0 : todayDay + 1;
    endSaturday.setDate(endSaturday.getDate() - daysBack);

    // Start exactly numWeeks * 7 days before the end (Sunday of the first week)
    const startSunday = new Date(endSaturday);
    startSunday.setDate(startSunday.getDate() - (numWeeks * 7 - 1));

    type DayCell = { date: string; count: number };
    const days: DayCell[] = [];

    const d = new Date(startSunday);
    while (d <= endSaturday) {
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        count: workoutDates[dateStr] || 0,
      });
      d.setDate(d.getDate() + 1);
    }

    // Group into weeks — exactly numWeeks columns of 7
    const cols: DayCell[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }

    // Build month row — label at the column containing the 1st of each month
    // This gives consistent 4–5 column spacing between labels
    const row: string[] = new Array(cols.length).fill("");
    // Always label the first column with its month
    row[0] = MONTH_NAMES[new Date(cols[0][0].date).getMonth()];
    // Then find columns containing the 1st of subsequent months
    for (let i = 0; i < cols.length; i++) {
      for (const day of cols[i]) {
        if (new Date(day.date).getDate() === 1) {
          row[i] = MONTH_NAMES[new Date(day.date).getMonth()];
          break;
        }
      }
    }

    return { weekColumns: cols, monthRow: row };
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
        <div>
          {/* Grid with month labels */}
          <div className="flex gap-[3px]">
            {weekColumns.map((week, wi) => (
              <div key={wi} className="w-[11px] shrink-0">
                {/* Month label */}
                <div className="h-[14px] mb-[2px] overflow-visible">
                  {monthRow[wi] && (
                    <span className="text-[9px] text-muted leading-none whitespace-nowrap block">
                      {monthRow[wi]}
                    </span>
                  )}
                </div>
                {/* Day cells */}
                <div className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-[11px] h-[11px] rounded-[2px] ${getColor(day.count)}`}
                      title={`${day.date}: ${day.count} workout${day.count !== 1 ? "s" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
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
