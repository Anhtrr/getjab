"use client";

import { useRef, useEffect, useCallback } from "react";

interface ScrollPickerItem {
  value: number;
  label: string;
}

interface ScrollPickerProps {
  items: ScrollPickerItem[];
  selectedValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function ScrollPicker({
  items,
  selectedValue,
  onChange,
  disabled = false,
}: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  // Scroll to selected item on mount and when selectedValue changes externally
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targetScroll = selectedIndex * ITEM_HEIGHT;
    if (!isScrollingRef.current) {
      container.scrollTop = targetScroll;
    }
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    if (disabled) return;
    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, index));

      // Smooth snap to nearest item
      container.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      if (items[clampedIndex] && items[clampedIndex].value !== selectedValue) {
        onChange(items[clampedIndex].value);
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(5);
        }
      }

      isScrollingRef.current = false;
    }, 80);
  }, [disabled, items, selectedValue, onChange]);

  const handleTap = useCallback(
    (index: number) => {
      if (disabled) return;
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });

      if (items[index] && items[index].value !== selectedValue) {
        onChange(items[index].value);
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(5);
        }
      }
    },
    [disabled, items, selectedValue, onChange],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const paddingCount = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: CONTAINER_HEIGHT }}
    >
      {/* Selection highlight bar */}
      <div
        className="absolute left-1 right-1 pointer-events-none z-10 rounded-lg"
        style={{
          top: paddingCount * ITEM_HEIGHT,
          height: ITEM_HEIGHT,
          background: "rgba(0,229,255,0.08)",
          borderTop: "1px solid rgba(0,229,255,0.15)",
          borderBottom: "1px solid rgba(0,229,255,0.15)",
        }}
      />

      {/* Fade edges - transparent black to blend with any parent background */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-20"
        style={{
          height: ITEM_HEIGHT,
          background:
            "linear-gradient(to bottom, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-20"
        style={{
          height: ITEM_HEIGHT,
          background:
            "linear-gradient(to top, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 100%)",
        }}
      />

      {/* Scrollable list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll hide-scrollbar"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Top padding */}
        {Array.from({ length: paddingCount }).map((_, i) => (
          <div key={`pad-top-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}

        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <div
              key={item.value}
              onClick={() => handleTap(index)}
              className={`flex items-center justify-center transition-all duration-150 ${
                disabled ? "" : "cursor-pointer"
              }`}
              style={{
                height: ITEM_HEIGHT,
                scrollSnapAlign: "center",
              }}
            >
              <span
                className={`font-mono transition-all duration-150 select-none ${
                  isSelected
                    ? "text-lg font-bold text-foreground"
                    : "text-sm text-muted/40"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}

        {/* Bottom padding */}
        {Array.from({ length: paddingCount }).map((_, i) => (
          <div key={`pad-bot-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
      </div>
    </div>
  );
}
