import type { Round, RoundType } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface RoundCardProps {
  round: Round;
  roundNumber: number;
  totalRounds: number;
  isActive: boolean;
}

const typeColors: Record<RoundType, string> = {
  warmup: "border-yellow-400/30 bg-yellow-400/5",
  technique: "border-blue-400/30 bg-blue-400/5",
  bagwork: "border-red-400/30 bg-red-400/5",
  conditioning: "border-orange-400/30 bg-orange-400/5",
  cooldown: "border-green-400/30 bg-green-400/5",
};

const typeTextColors: Record<RoundType, string> = {
  warmup: "text-yellow-400",
  technique: "text-blue-400",
  bagwork: "text-red-400",
  conditioning: "text-orange-400",
  cooldown: "text-green-400",
};

export default function RoundCard({
  round,
  roundNumber,
  totalRounds,
  isActive,
}: RoundCardProps) {
  return (
    <div
      className={`border rounded-2xl p-5 transition-all ${
        isActive
          ? `${typeColors[round.type]} ring-1 ring-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-fade-in-scale`
          : "border-border bg-surface/50 opacity-40"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-mono">
            {roundNumber}/{totalRounds}
          </span>
          <span className={`text-xs font-medium uppercase ${typeTextColors[round.type]}`}>
            {round.type}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-2">{round.title}</h3>
      <p className="text-sm text-muted leading-relaxed mb-3">
        {round.instructions}
      </p>

      {round.combos && round.combos.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {round.combos.map((combo, i) => (
            <div
              key={i}
              className="font-mono text-sm bg-background/50 border border-border rounded-lg px-3 py-2 text-foreground"
            >
              {combo}
            </div>
          ))}
        </div>
      )}

      {round.tips && round.tips.length > 0 && isActive && (
        <div className="space-y-1 mt-3 pt-3 border-t border-border/50">
          {round.tips.map((tip, i) => (
            <p key={i} className="text-xs text-muted flex items-start gap-1.5">
              <ChevronRight className="w-3 h-3 text-accent-secondary mt-0.5 shrink-0" />
              {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
