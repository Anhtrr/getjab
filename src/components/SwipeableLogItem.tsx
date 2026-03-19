"use client";

import { useRef, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableLogItemProps {
  children: React.ReactNode;
  onDelete: () => void;
}

const DELETE_THRESHOLD = 80;

export default function SwipeableLogItem({ children, onDelete }: SwipeableLogItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = 0;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return;
    const diff = e.touches[0].clientX - startXRef.current;
    // Only allow left swipe
    const clamped = Math.min(0, Math.max(-140, diff));
    currentXRef.current = clamped;
    setOffset(clamped);
  }, [swiping]);

  const handleTouchEnd = useCallback(() => {
    setSwiping(false);
    if (currentXRef.current < -DELETE_THRESHOLD) {
      setOffset(-140);
      setShowConfirm(true);
    } else {
      setOffset(0);
      setShowConfirm(false);
    }
  }, []);

  const handleDelete = useCallback(() => {
    setOffset(-1000);
    setTimeout(onDelete, 200);
  }, [onDelete]);

  const handleCancel = useCallback(() => {
    setOffset(0);
    setShowConfirm(false);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <div className="absolute inset-0 flex items-center justify-end rounded-xl">
        <div
          className={`h-full flex items-center justify-center rounded-xl transition-all ${
            showConfirm ? "w-[140px]" : "w-[80px]"
          }`}
        >
          {showConfirm ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-xl bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.5)] animate-pulse"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          ) : (
            <Trash2 className="w-5 h-5 text-red-400" />
          )}
        </div>
      </div>

      {/* Swipeable content */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={showConfirm ? handleCancel : undefined}
        className="relative bg-background"
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? "none" : "transform 0.25s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
