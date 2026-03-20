import type { ParsedPunch, ParsedCombo } from "./types";

const PUNCH_REGISTRY: Record<
  number,
  { name: string; shortName: string; hand: "lead" | "rear"; type: "straight" | "hook" | "uppercut" }
> = {
  1: { name: "Jab", shortName: "JAB", hand: "lead", type: "straight" },
  2: { name: "Cross", shortName: "CROSS", hand: "rear", type: "straight" },
  3: { name: "Lead Hook", shortName: "HOOK", hand: "lead", type: "hook" },
  4: { name: "Rear Hook", shortName: "HOOK", hand: "rear", type: "hook" },
  5: { name: "Lead Uppercut", shortName: "UPPER", hand: "lead", type: "uppercut" },
  6: { name: "Rear Uppercut", shortName: "UPPER", hand: "rear", type: "uppercut" },
};

const DEFENSE_REGISTRY: Record<
  string,
  { name: string; shortName: string; hand: "lead" | "rear"; type: "defense" }
> = {
  // Simplified notation (no direction specified)
  Slip: { name: "Slip", shortName: "SLIP", hand: "lead", type: "defense" },
  Roll: { name: "Roll", shortName: "ROLL", hand: "lead", type: "defense" },
  Pull: { name: "Pull", shortName: "PULL", hand: "lead", type: "defense" },
  // Legacy directional notation (backward compatibility)
  SL: { name: "Slip Left", shortName: "SLIP", hand: "lead", type: "defense" },
  SR: { name: "Slip Right", shortName: "SLIP", hand: "rear", type: "defense" },
  RL: { name: "Roll Left", shortName: "ROLL", hand: "lead", type: "defense" },
  RR: { name: "Roll Right", shortName: "ROLL", hand: "rear", type: "defense" },
  PL: { name: "Parry Left", shortName: "PARRY", hand: "lead", type: "defense" },
  PR: { name: "Parry Right", shortName: "PARRY", hand: "rear", type: "defense" },
};

/**
 * Parse a raw combo string like "1-2-SL-3 (Jab-Cross-Slip Left-Hook)" into structured data.
 * Handles standard combos, body/head targets, defense moves, and freeform fallbacks.
 */
export function parseCombo(raw: string): ParsedCombo {
  const trimmed = raw.trim();

  // Extract the portion before any parenthetical
  const parenIndex = trimmed.indexOf("(");
  const tokenPart = (parenIndex >= 0 ? trimmed.slice(0, parenIndex) : trimmed).trim();

  // Split on hyphens
  const tokens = tokenPart.split("-").map((t) => t.trim()).filter(Boolean);

  const punches: ParsedPunch[] = [];
  let isCallable = true;

  for (const token of tokens) {
    // Check for target modifiers: "body", "head"
    if (token === "body" || token === "head") {
      if (punches.length > 0) {
        punches[punches.length - 1].target = token;
      }
      continue;
    }

    // Check for "3body", "3head" style (no hyphen separator)
    const targetMatch = token.match(/^(\d)(body|head)$/);
    if (targetMatch) {
      const num = parseInt(targetMatch[1], 10);
      const target = targetMatch[2] as "body" | "head";
      const reg = PUNCH_REGISTRY[num];
      if (reg) {
        punches.push({ number: num, ...reg, target });
        continue;
      }
    }

    // Check for defense tokens (case-insensitive)
    const upper = token.toUpperCase();
    if (DEFENSE_REGISTRY[upper]) {
      const def = DEFENSE_REGISTRY[upper];
      punches.push({ number: upper, ...def });
      continue;
    }

    // Check for numeric punch
    const num = parseInt(token, 10);
    if (!isNaN(num) && PUNCH_REGISTRY[num]) {
      const reg = PUNCH_REGISTRY[num];
      punches.push({ number: num, ...reg });
    } else {
      // Unrecognized token - freeform
      isCallable = false;
      break;
    }
  }

  // If we got no punches or it's not callable, return freeform
  if (punches.length === 0 || !isCallable) {
    return {
      raw: trimmed,
      punches: [],
      isCallable: false,
      displayLabel: trimmed,
    };
  }

  // Build display label from punch names
  const displayLabel = punches
    .map((p) => {
      let label = p.name;
      if (p.target) label = `${p.target === "body" ? "Body" : "Head"} ${label}`;
      return label;
    })
    .join("-");

  return {
    raw: trimmed,
    punches,
    isCallable: true,
    displayLabel,
  };
}

/** Parse all combos for a round */
export function parseRoundCombos(combos: string[]): ParsedCombo[] {
  return combos.map(parseCombo);
}

/** Get only the callable combos from a parsed list */
export function getCallableCombos(parsed: ParsedCombo[]): ParsedCombo[] {
  return parsed.filter((c) => c.isCallable);
}
