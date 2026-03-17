import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Combo Reference - Jab",
};

const punches = [
  {
    number: "1",
    name: "Jab",
    hand: "Lead hand",
    description:
      "A quick, straight punch with your lead hand. The most important punch in boxing. Used to measure distance, set up combos, and keep your opponent honest.",
    tips: [
      "Extend your arm fully and snap it back",
      "Step forward slightly as you throw",
      "Keep your rear hand glued to your chin",
    ],
  },
  {
    number: "2",
    name: "Cross",
    hand: "Rear hand",
    description:
      "A powerful straight punch with your rear hand. Your main power punch. Rotate your hips and shoulders for maximum force.",
    tips: [
      "Pivot your back foot as you throw",
      "Full hip and shoulder rotation",
      "The power comes from the ground up",
    ],
  },
  {
    number: "3",
    name: "Lead Hook",
    hand: "Lead hand",
    description:
      "A short, arcing punch from the side with your lead hand. Devastating at close range. Can target the head or body.",
    tips: [
      "Keep your elbow at 90 degrees",
      "Pivot your lead foot and rotate your hips",
      "Compact punch - don't swing wide",
    ],
  },
  {
    number: "4",
    name: "Rear Hook",
    hand: "Rear hand",
    description:
      "A hook thrown with your rear hand. Less common but effective when you've created the angle. Often used in close-range exchanges.",
    tips: [
      "Similar mechanics to the lead hook, opposite side",
      "Often follows a lead hook naturally",
      "Pivot your rear foot for power",
    ],
  },
  {
    number: "5",
    name: "Lead Uppercut",
    hand: "Lead hand",
    description:
      "An upward punch with your lead hand. Targets the chin or body at close range. Dip slightly before driving upward.",
    tips: [
      "Bend your knees before throwing",
      "Drive upward with your legs",
      "Palm faces toward you at impact",
    ],
  },
  {
    number: "6",
    name: "Rear Uppercut",
    hand: "Rear hand",
    description:
      "A powerful upward punch with your rear hand. The most dangerous uppercut. Can end fights when landed cleanly on the chin.",
    tips: [
      "Drop your rear hand slightly before driving up",
      "Rotate your hips into the punch",
      "Short range - don't reach",
    ],
  },
];

const commonCombos = [
  {
    notation: "1-2",
    name: "Jab-Cross",
    description: "The bread and butter of boxing. Use it constantly.",
  },
  {
    notation: "1-1-2",
    name: "Double Jab-Cross",
    description: "Double the distraction, same power finish.",
  },
  {
    notation: "1-2-3",
    name: "Jab-Cross-Hook",
    description:
      "The classic 3-punch combo. The hook catches them after the cross.",
  },
  {
    notation: "1-2-3-2",
    name: "Jab-Cross-Hook-Cross",
    description: "Four-punch flow. The final cross is often the one that lands.",
  },
  {
    notation: "1-2-5-2",
    name: "Jab-Cross-Uppercut-Cross",
    description: "The uppercut creates the opening for the final cross.",
  },
  {
    notation: "1-6-3-2",
    name: "Jab-Uppercut-Hook-Cross",
    description: "Jab high, go low with the uppercut, then finish upstairs.",
  },
  {
    notation: "1-2-3-2-3-2",
    name: "Six-Punch Combo",
    description: "The long combo. Keep the pressure on with alternating hooks and crosses.",
  },
];

export default function CombosPage() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
      <Link
        href="/"
        className="text-muted text-sm hover:text-foreground mb-4 inline-block"
      >
        &larr; Home
      </Link>

      <h1 className="text-2xl font-bold mb-2 animate-fade-in-up">Boxing Punch Numbers</h1>
      <p className="text-muted text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "60ms" }}>
        In boxing, every punch has a number. This numbering system lets trainers
        call out combinations quickly. Learn these and you&apos;ll understand any
        combo.
      </p>

      <div className="space-y-4 mb-10 stagger-children">
        {punches.map((punch) => (
          <div
            key={punch.number}
            className="card-glass rounded-2xl p-5 card-premium animate-fade-in-up"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#0090ff] text-black font-black text-xl flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {punch.number}
              </span>
              <div>
                <h2 className="font-bold text-lg">{punch.name}</h2>
                <span className="text-xs text-muted">{punch.hand}</span>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-3">
              {punch.description}
            </p>
            <div className="space-y-1">
              {punch.tips.map((tip, i) => (
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
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Common Combinations</h2>
      <div className="space-y-3 mb-8">
        {commonCombos.map((combo) => (
          <div
            key={combo.notation}
            className="card-glass rounded-xl p-4 hover:border-[#00e5ff]/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono font-bold text-accent text-lg">
                {combo.notation}
              </span>
            </div>
            <p className="text-sm font-medium mb-0.5">{combo.name}</p>
            <p className="text-xs text-muted">{combo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
