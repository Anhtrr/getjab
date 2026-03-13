"use client";

import { useState, useMemo, useCallback } from "react";
import { X, Save, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { TimerSettings as TimerSettingsType } from "@/lib/types";
import {
  getPresets,
  savePreset,
  deletePreset,
  findMatchingPreset,
  trackPresetUsage,
  type TimerPreset,
} from "@/lib/timerPresets";
import ScrollPicker from "./ScrollPicker";

interface TimerSettingsProps {
  settings: TimerSettingsType;
  onChange: (settings: TimerSettingsType) => void;
  disabled: boolean;
}

function formatMinSec(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function PillSelector({
  label,
  options,
  selectedValue,
  onChange,
  disabled,
}: {
  label: string;
  options: { value: number; label: string }[];
  selectedValue: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">
        {label}
      </p>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 ${
              selectedValue === opt.value
                ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                : "bg-surface border border-border text-muted hover:text-foreground hover:border-[#00e5ff]/20"
            } disabled:opacity-30`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TimerSettings({
  settings,
  onChange,
  disabled,
}: TimerSettingsProps) {
  const [presetVersion, setPresetVersion] = useState(0);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const presets = useMemo(() => getPresets(), [presetVersion]);
  const activePreset = useMemo(() => findMatchingPreset(settings), [settings]);

  const update = (patch: Partial<TimerSettingsType>) =>
    onChange({ ...settings, ...patch });

  const handleSelectPreset = useCallback(
    (preset: TimerPreset) => {
      trackPresetUsage(preset.id);
      setPresetVersion((v) => v + 1);
      onChange({
        ...preset.settings,
        muted: settings.muted,
        hapticEnabled: settings.hapticEnabled,
      });
    },
    [onChange, settings.muted, settings.hapticEnabled],
  );

  const handleSavePreset = useCallback(() => {
    const name = window.prompt("Name this preset:");
    if (!name || !name.trim()) return;
    savePreset(name.trim(), settings);
    setPresetVersion((v) => v + 1);
  }, [settings]);

  const handleDeletePreset = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      deletePreset(id);
      setPresetVersion((v) => v + 1);
    },
    [],
  );

  // Generate picker items
  const roundItems = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
    [],
  );

  const roundTimeItems = useMemo(() => {
    const items: { value: number; label: string }[] = [];
    for (let sec = 10; sec <= 600; sec += 10) {
      items.push({ value: sec, label: formatMinSec(sec) });
    }
    return items;
  }, []);

  const restTimeItems = useMemo(() => {
    const items: { value: number; label: string }[] = [];
    for (let sec = 10; sec <= 180; sec += 10) {
      items.push({ value: sec, label: formatMinSec(sec) });
    }
    return items;
  }, []);

  const warningOptions = [
    { value: 0, label: "Off" },
    { value: 10, label: "10s" },
    { value: 15, label: "15s" },
    { value: 20, label: "20s" },
    { value: 30, label: "30s" },
  ];

  const prepOptions = [
    { value: 0, label: "Off" },
    { value: 5, label: "5s" },
    { value: 10, label: "10s" },
    { value: 15, label: "15s" },
  ];

  const soundOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "On" },
  ];

  const hapticOptions = [
    { value: 0, label: "Off" },
    { value: 1, label: "On" },
  ];

  // Show first row (2 presets) + save button by default, expand for all
  const visiblePresets = showAllPresets ? presets : presets.slice(0, 2);
  const hasMorePresets = presets.length > 2;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Preset Cards */}
      <div>
        <div className="grid grid-cols-2 gap-2">
          {visiblePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              disabled={disabled}
              className={`relative text-left card-glass rounded-xl p-3 transition-all active:scale-[0.97] ${
                activePreset?.id === preset.id
                  ? "border-[#00e5ff]/40 animate-preset-glow"
                  : "hover:border-[#00e5ff]/20"
              } disabled:opacity-30`}
            >
              <p className="font-semibold text-sm truncate pr-4">
                {preset.name}
              </p>
              <p className="text-[10px] text-muted mt-0.5">
                {preset.settings.rounds} ×{" "}
                {formatMinSec(preset.settings.roundDurationSec)} /{" "}
                {formatMinSec(preset.settings.restDurationSec)} rest
              </p>
              {!preset.isBuiltIn && (
                <span
                  onClick={(e) => handleDeletePreset(e, preset.id)}
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-3 h-3 text-muted" />
                </span>
              )}
            </button>
          ))}
          {/* Save Current — only visible when expanded or few presets */}
          {(showAllPresets || presets.length <= 2) && (
            <button
              onClick={handleSavePreset}
              disabled={disabled}
              className="text-left card-glass rounded-xl p-3 border-dashed border-border hover:border-[#00e5ff]/20 transition-all active:scale-[0.97] disabled:opacity-30"
            >
              <div className="flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-muted" />
                <p className="font-semibold text-sm text-muted">Save Current</p>
              </div>
              <p className="text-[10px] text-muted mt-0.5">
                {settings.rounds} × {formatMinSec(settings.roundDurationSec)} /{" "}
                {formatMinSec(settings.restDurationSec)} rest
              </p>
            </button>
          )}
        </div>
        {/* Show All / Show Less toggle */}
        {hasMorePresets && (
          <button
            onClick={() => setShowAllPresets(!showAllPresets)}
            className="flex items-center justify-center gap-1 w-full mt-2 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
          >
            <span>{showAllPresets ? "Show Less" : `Show All (${presets.length})`}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAllPresets ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Customize toggle */}
      <button
        onClick={() => setShowCustomize(!showCustomize)}
        disabled={disabled}
        className="flex items-center justify-between w-full card-glass rounded-xl px-4 py-3 transition-all hover:border-[#00e5ff]/20 active:scale-[0.98] disabled:opacity-30"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted" />
          <span className="text-sm font-medium">Customize</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform ${showCustomize ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible settings */}
      {showCustomize && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Scroll pickers */}
          <div className="card-glass rounded-2xl p-4 overflow-hidden">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-center mb-1">
                  Rounds
                </p>
                <ScrollPicker
                  items={roundItems}
                  selectedValue={settings.rounds}
                  onChange={(v) => update({ rounds: v })}
                  disabled={disabled}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-center mb-1">
                  Round
                </p>
                <ScrollPicker
                  items={roundTimeItems}
                  selectedValue={settings.roundDurationSec}
                  onChange={(v) => update({ roundDurationSec: v })}
                  disabled={disabled}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-center mb-1">
                  Rest
                </p>
                <ScrollPicker
                  items={restTimeItems}
                  selectedValue={settings.restDurationSec}
                  onChange={(v) => update({ restDurationSec: v })}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          {/* All settings consolidated */}
          <div className="card-glass rounded-2xl p-4 space-y-4">
            <PillSelector
              label="Warning"
              options={warningOptions}
              selectedValue={settings.warningAtSec}
              onChange={(v) => update({ warningAtSec: v })}
              disabled={disabled}
            />
            <PillSelector
              label="Get Ready"
              options={prepOptions}
              selectedValue={settings.prepTimeSec}
              onChange={(v) => update({ prepTimeSec: v })}
              disabled={disabled}
            />
            <div className="border-t border-border/30" />
            <PillSelector
              label="Sound"
              options={soundOptions}
              selectedValue={settings.muted ? 0 : 1}
              onChange={(v) => update({ muted: v === 0 })}
              disabled={disabled}
            />
            <PillSelector
              label="Haptic"
              options={hapticOptions}
              selectedValue={settings.hapticEnabled ? 1 : 0}
              onChange={(v) => update({ hapticEnabled: v === 1 })}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}
