import type { TimerSettings } from "@/lib/types";

export interface TimerPreset {
  id: string;
  name: string;
  settings: TimerSettings;
  isBuiltIn: boolean;
}

const STORAGE_KEY = "jab_timer_presets";
const USAGE_KEY = "jab_preset_usage";

const BUILT_IN_PRESETS: TimerPreset[] = [
  {
    id: "boxing-classic",
    name: "Boxing Classic",
    isBuiltIn: true,
    settings: {
      rounds: 12,
      roundDurationSec: 180,
      restDurationSec: 60,
      warningAtSec: 10,
      prepTimeSec: 5,
    },
  },
  {
    id: "quick-rounds",
    name: "Quick Rounds",
    isBuiltIn: true,
    settings: {
      rounds: 6,
      roundDurationSec: 120,
      restDurationSec: 30,
      warningAtSec: 10,
      prepTimeSec: 5,
    },
  },
  {
    id: "muay-thai",
    name: "Muay Thai",
    isBuiltIn: true,
    settings: {
      rounds: 5,
      roundDurationSec: 180,
      restDurationSec: 120,
      warningAtSec: 10,
      prepTimeSec: 10,
    },
  },
  {
    id: "hiit-bag",
    name: "HIIT Bag Work",
    isBuiltIn: true,
    settings: {
      rounds: 8,
      roundDurationSec: 30,
      restDurationSec: 15,
      warningAtSec: 5,
      prepTimeSec: 5,
    },
  },
];

function loadCustomPresets(): TimerPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCustomPresets(presets: TimerPreset[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {}
}

function loadUsageTimestamps(): Record<string, number> {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function trackPresetUsage(id: string) {
  try {
    const usage = loadUsageTimestamps();
    usage[id] = Date.now();
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  } catch {}
}

export function getPresets(): TimerPreset[] {
  const all = [...BUILT_IN_PRESETS, ...loadCustomPresets()];
  const usage = loadUsageTimestamps();
  // Sort by last-used time (most recent first), unused presets keep original order at end
  return all.sort((a, b) => {
    const aTime = usage[a.id] ?? 0;
    const bTime = usage[b.id] ?? 0;
    if (aTime === 0 && bTime === 0) return 0; // preserve original order for never-used
    if (aTime === 0) return 1; // unused goes after used
    if (bTime === 0) return -1;
    return bTime - aTime; // most recent first
  });
}

export function savePreset(name: string, settings: TimerSettings): TimerPreset {
  const custom = loadCustomPresets();
  const preset: TimerPreset = {
    id: `custom-${Date.now()}`,
    name,
    settings: { ...settings },
    isBuiltIn: false,
  };
  custom.push(preset);
  saveCustomPresets(custom);
  return preset;
}

export function deletePreset(id: string) {
  const custom = loadCustomPresets().filter((p) => p.id !== id);
  saveCustomPresets(custom);
}

/** Check if current settings match a preset (ignoring muted/haptic) */
export function findMatchingPreset(
  settings: TimerSettings,
): TimerPreset | null {
  const all = getPresets();
  return (
    all.find(
      (p) =>
        p.settings.rounds === settings.rounds &&
        p.settings.roundDurationSec === settings.roundDurationSec &&
        p.settings.restDurationSec === settings.restDurationSec &&
        p.settings.warningAtSec === settings.warningAtSec &&
        p.settings.prepTimeSec === settings.prepTimeSec,
    ) ?? null
  );
}
