"use client";

import { useRef, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableLogItemProps {
  children: React.ReactNode;
  onDelete: () => void;
}

const DELETE_THRESHOLD = 40;
const SNAP_OFFSET = -64;

export default function SwipeableLogItem({ children, onDelete }: SwipeableLogItemProps) {
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentXRef = useRef(0);
  const directionRef = useRef<"horizontal" | "vertical" | null>(null);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    currentXRef.current = 0;
    directionRef.current = null;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swiping) return;

    const diffX = e.touches[0].clientX - startXRef.current;
    const diffY = e.touches[0].clientY - startYRef.current;

    // Lock direction on first significant movement
    if (!directionRef.current) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        directionRef.current = Math.abs(diffX) > Math.abs(diffY) ? "horizontal" : "vertical";
      }
      return;
    }

    // If vertical, let the page scroll normally
    if (directionRef.current === "vertical") return;

    // Horizontal swipe - prevent scroll and move the card
    e.preventDefault();
    const clamped = Math.min(0, Math.max(SNAP_OFFSET, diffX));
    currentXRef.current = clamped;
    setOffset(clamped);
  }, [swiping]);

  const handleTouchEnd = useCallback(() => {
    setSwiping(false);
    if (currentXRef.current < -DELETE_THRESHOLD) {
      setOffset(SNAP_OFFSET);
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
    <div className="relative">
      {/* Delete button - only visible when swiped */}
      {(showConfirm || offset < 0) && (
        <div className="absolute right-2 inset-y-0 flex items-center">
          {showConfirm ? (
            <button
              onClick={handleDelete}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-red-500 text-white animate-delete-glow"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : (
            <Trash2 className="w-5 h-5 text-red-400/50" />
          )}
        </div>
      )}

      {/* Swipeable content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={showConfirm ? handleCancel : undefined}
        className="relative rounded-xl"
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
