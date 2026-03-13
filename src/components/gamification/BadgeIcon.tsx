"use client";

import {
  Target,
  TrendingUp,
  Flame,
  Zap,
  Star,
  Trophy,
  Crown,
  CalendarCheck,
  Shield,
  Gem,
  Wrench,
  Layers,
  Timer,
  Clock,
  Hourglass,
  BarChart3,
  Award,
  Sunrise,
  Moon,
  Sparkles,
  Skull,
  CheckCircle2,
  Medal,
  type LucideIcon,
} from "lucide-react";
import type { BadgeRarity } from "@/lib/gamification/types";

const ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  "trending-up": TrendingUp,
  flame: Flame,
  zap: Zap,
  star: Star,
  trophy: Trophy,
  crown: Crown,
  "calendar-check": CalendarCheck,
  bolt: Zap,
  shield: Shield,
  gem: Gem,
  wrench: Wrench,
  layers: Layers,
  timer: Timer,
  clock: Clock,
  hourglass: Hourglass,
  "bar-chart-3": BarChart3,
  award: Award,
  sunrise: Sunrise,
  moon: Moon,
  sparkles: Sparkles,
  skull: Skull,
  "check-circle-2": CheckCircle2,
  medal: Medal,
};

const RARITY_ICON_COLOR: Record<BadgeRarity, string> = {
  common: "text-white/70",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

const RARITY_BG: Record<BadgeRarity, string> = {
  common: "bg-white/5",
  rare: "bg-blue-500/10",
  epic: "bg-purple-500/10",
  legendary: "bg-yellow-500/10",
};

interface BadgeIconProps {
  icon: string;
  rarity: BadgeRarity;
  size?: "sm" | "md" | "lg";
  earned?: boolean;
}

export default function BadgeIcon({ icon, rarity, size = "md", earned = true }: BadgeIconProps) {
  const Icon = ICON_MAP[icon];
  if (!Icon) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  if (!earned) {
    return <Icon className={`${sizeClasses[size]} text-muted/30`} />;
  }

  return (
    <Icon
      className={`${sizeClasses[size]} ${RARITY_ICON_COLOR[rarity]}`}
      strokeWidth={size === "lg" ? 1.5 : 2}
    />
  );
}

export function BadgeIconContainer({
  icon,
  rarity,
  earned = true,
  size = "md",
}: BadgeIconProps) {
  const containerSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  return (
    <div
      className={`${containerSizes[size]} rounded-xl flex items-center justify-center ${
        earned ? RARITY_BG[rarity] : "bg-border/15"
      }`}
    >
      <BadgeIcon icon={icon} rarity={rarity} size={size} earned={earned} />
    </div>
  );
}
