"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const steps = [
  {
    title: "Get in Your Stance",
    subtitle: "The foundation of everything",
    content: [
      "Stand with your feet shoulder-width apart.",
      "If you're right-handed (orthodox): left foot forward, right foot back.",
      "If you're left-handed (southpaw): right foot forward, left foot back.",
      "Keep your weight balanced 50/50 on both feet.",
      "Stay on the balls of your feet - heels slightly raised.",
      "Bring your hands up to chin level, elbows tucked to your body.",
      "Chin down, eyes up. This is your fighting stance.",
    ],
    tips: [
      "Your feet should be at about 45 degrees, not straight",
      "Think of your stance as a platform - stable but mobile",
    ],
  },
  {
    title: "Learn to Move",
    subtitle: "Footwork basics",
    content: [
      "In boxing, you move by stepping, not by crossing your feet.",
      "To go FORWARD: step with your lead foot first, then bring the rear foot.",
      "To go BACK: step with your rear foot first, then bring the lead foot.",
      "To go LEFT: step with your left foot first, then the right follows.",
      "To go RIGHT: step with your right foot first, then the left follows.",
      "Keep the same distance between your feet at all times.",
      "Practice moving in all directions while maintaining your stance.",
    ],
    tips: [
      "Small, quick steps - don't overstep",
      "Never let your feet come together",
      "Stay balanced - you should be able to punch at any moment",
    ],
  },
  {
    title: "Throw the Jab (1)",
    subtitle: "The most important punch",
    content: [
      "From your stance, extend your LEAD hand straight out.",
      "Rotate your fist so your palm faces DOWN at full extension.",
      "SNAP it back to your chin immediately - fast out, fast back.",
      "Your rear hand stays glued to your chin while you jab.",
      "Exhale sharply as you throw the punch.",
      "Step forward slightly with your jab to add range.",
      "Practice: throw 10 jabs, focusing on speed and snap.",
    ],
    tips: [
      "The jab is about SPEED, not power",
      "Think of it like flicking a whip",
      "The retraction is as important as the extension",
    ],
  },
  {
    title: "Throw the Cross (2)",
    subtitle: "Your power punch",
    content: [
      "From your stance, throw your REAR hand straight forward.",
      "Simultaneously: pivot your back foot, rotate your hips, turn your shoulder.",
      "Your whole body should rotate like a corkscrew.",
      "The power comes from the GROUND, through your legs and hips, into the punch.",
      "Return to your stance immediately after.",
      "Practice: throw 10 crosses, focusing on hip rotation.",
    ],
    tips: [
      "Your back heel should lift off the ground as you pivot",
      "Rotate your hips fully - this is where the power lives",
      "Don't reach - step in first if needed",
    ],
  },
  {
    title: "The 1-2 Combo",
    subtitle: "Jab-Cross, the bread and butter",
    content: [
      "Now combine them! Throw the jab, then immediately the cross.",
      "The jab sets up the cross. It measures distance and blinds the opponent.",
      "Rhythm: SNAP-BANG. Quick jab, hard cross.",
      "Both punches go straight and come straight back.",
      "After the combo, move. Step to the side or back.",
      "Practice: throw 20 x 1-2 combos with movement between each.",
    ],
    tips: [
      "Don't pause between the jab and cross - let them flow",
      "The cross should come the instant the jab returns",
      "Move your feet BETWEEN combos, not during",
    ],
  },
  {
    title: "Shadow Boxing",
    subtitle: "Put it all together",
    content: [
      "Shadow boxing is practicing against an imaginary opponent.",
      "Move around the room in your stance.",
      "Throw single jabs as you move.",
      "Mix in 1-2 combos.",
      "Practice for 2-3 minutes (one 'round').",
      "Rest 30-60 seconds, then do another round.",
      "Do 3 rounds total for your first session.",
    ],
    tips: [
      "Visualize an opponent in front of you",
      "Breathe out with every punch",
      "Start slow and focus on form over speed",
      "It's normal to feel awkward at first - everyone does!",
    ],
  },
  {
    title: "You're Ready!",
    subtitle: "Next steps",
    content: [
      "Congratulations! You know the fundamentals of boxing.",
      "You know your stance, basic footwork, the jab, the cross, and the 1-2 combo.",
      "That's enough to start any beginner workout in this app.",
      "Next, try the 'Your First Boxing Workout' in the workout library.",
      "Check out the Combo Reference to learn all 6 punch numbers.",
      "Use the Round Timer for your shadow boxing sessions.",
      "Most importantly: be consistent. 3 times a week and you'll see results.",
    ],
    tips: [
      "Boxing is a skill - it gets easier with practice",
      "Focus on form before speed, speed before power",
      "Have fun with it!",
    ],
  },
];

const SWIPE_THRESHOLD = 50;

export default function FirstWorkoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  const goTo = useCallback((next: number) => {
    if (next < 0 || next >= steps.length || isAnimating) return;
    const direction = next > currentStep ? -1 : 1;

    // Slide out
    setIsAnimating(true);
    setOffsetX(direction * window.innerWidth);

    setTimeout(() => {
      setCurrentStep(next);
      // Position off-screen on the incoming side
      setOffsetX(-direction * window.innerWidth);

      // Slide in on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOffsetX(0);
          setTimeout(() => setIsAnimating(false), 300);
        });
      });
    }, 200);
  }, [currentStep, isAnimating]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAnimating) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    };
  }, [isAnimating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnimating) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;

    // If scrolling more vertically than horizontally, don't handle
    if (Math.abs(dy) > Math.abs(dx)) return;

    // Resist at edges
    if ((isFirst && dx > 0) || (isLast && dx < 0)) {
      setOffsetX(dx * 0.2);
    } else {
      setOffsetX(dx);
    }
  }, [isAnimating, isFirst, isLast]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || isAnimating) return;

    const dx = offsetX;
    touchStartRef.current = null;

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && !isLast) {
        goTo(currentStep + 1);
        return;
      }
      if (dx > 0 && !isFirst) {
        goTo(currentStep - 1);
        return;
      }
    }

    // Snap back
    setOffsetX(0);
  }, [offsetX, isAnimating, isFirst, isLast, currentStep, goTo]);

  return (
    <div className="px-4 pt-8 pb-8 max-w-lg mx-auto overflow-hidden">
      <Link
        href="/"
        className="text-muted text-sm hover:text-foreground mb-4 inline-block"
      >
        &larr; Home
      </Link>

      {/* Progress dots - tappable */}
      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= currentStep
                ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] shadow-[0_0_4px_rgba(0,229,255,0.2)]"
                : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Swipeable content */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="touch-pan-y select-none"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isAnimating || !touchStartRef.current ? "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          willChange: "transform",
        }}
      >
        <div className="mb-2">
          <span className="text-xs text-muted font-mono">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-1">{step.title}</h1>
        <p className="text-muted text-sm mb-6">{step.subtitle}</p>

        <div className="space-y-3 mb-6">
          {step.content.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {step.tips.length > 0 && (
          <div className="card-glass rounded-xl p-4 mb-8">
            <p className="text-xs font-bold text-accent-secondary uppercase tracking-wide mb-2">
              Tips
            </p>
            <div className="space-y-1.5">
              {step.tips.map((tip, i) => (
                <p
                  key={i}
                  className="text-xs text-muted flex items-start gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-accent-secondary mt-0.5 shrink-0" />
                  {tip}
                </p>
              ))}
            </div>
          </div>
        )}

        {isLast && (
          <Link
            href="/workouts/first-boxing-workout"
            className="block w-full text-center btn-primary py-4 rounded-full text-lg"
          >
            Start a Workout
          </Link>
        )}
      </div>

      {/* Swipe hint - only on first step */}
      {currentStep === 0 && (
        <p className="text-center text-xs text-muted mt-6 animate-fade-in">
          Swipe to continue
        </p>
      )}
    </div>
  );
}
