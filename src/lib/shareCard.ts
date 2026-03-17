import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import type { BoxingTitle } from "./gamification/types";

export interface ShareCardData {
  workoutTitle: string;
  roundsCompleted: number;
  totalRounds: number;
  durationMin: number;
  xpEarned: number;
  level: number;
  title: BoxingTitle;
  streakCurrent: number;
  date: string; // YYYY-MM-DD
  displayName?: string;
  punchesThrown?: number;
  caloriesEstimate?: number;
  location?: string; // optional gym/location tag
  // XP progression toward next level
  currentXP?: number;
  xpForNextLevel?: number;
  progressPercent?: number;
}

const CARD_W = 1080;
const CARD_H = 1920;
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStatCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
) {
  drawRoundedRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = `800 48px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(value, x + w / 2, y + h / 2 + 4);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = `600 20px ${FONT}`;
  ctx.letterSpacing = "3px";
  ctx.fillText(label, x + w / 2 + 2, y + h / 2 + 42);
  ctx.letterSpacing = "0px";
}

export async function generateShareCard(
  data: ShareCardData,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;

  // ─── Background ───
  drawCardBackground(ctx);

  // ─── Date (top center - safe from profile pic overlay) ───
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = `400 22px ${FONT}`;
  ctx.fillText(formatDate(data.date), CARD_W / 2, 120);

  if (data.location) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.font = `500 20px ${FONT}`;
    ctx.fillText(`📍 ${data.location}`, CARD_W / 2, 150);
  }

  // ─── Display Name (hero) ───
  let y = 260;

  if (data.displayName) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 64px ${FONT}`;
    ctx.fillText(data.displayName.toUpperCase(), CARD_W / 2, y);
    y += 70;
  }

  // ─── Level pill: "LVL 5 · CONTENDER" ───
  const levelText = `LVL ${data.level}  ·  ${data.title.toUpperCase()}`;
  ctx.font = `700 24px ${FONT}`;
  ctx.letterSpacing = "3px";
  const pillWidth = ctx.measureText(levelText).width + 50;
  const pillX = (CARD_W - pillWidth) / 2;
  const pillY = y - 8;

  drawRoundedRect(ctx, pillX, pillY, pillWidth, 44, 22);
  ctx.fillStyle = "rgba(0, 229, 255, 0.1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 229, 255, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#00e5ff";
  ctx.font = `700 22px ${FONT}`;
  ctx.letterSpacing = "3px";
  ctx.fillText(levelText, CARD_W / 2 + 2, pillY + 29);
  ctx.letterSpacing = "0px";
  y += 100;

  // ─── Headline ───
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = `700 26px ${FONT}`;
  ctx.letterSpacing = "8px";
  const headline = data.roundsCompleted >= data.totalRounds
    ? "WENT THE DISTANCE"
    : "PUT IN WORK";
  ctx.fillText(headline, CARD_W / 2 + 4, y);
  ctx.letterSpacing = "0px";
  y += 75;

  // ─── Workout Title ───
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 52px ${FONT}`;
  const titleLines = wrapText(ctx, data.workoutTitle, CARD_W - 120);
  for (const line of titleLines) {
    ctx.fillText(line, CARD_W / 2, y);
    y += 66;
  }
  y += 60;

  // ─── Stats 2x2 grid ───
  const pad = 50;
  const gap = 20;
  const cardW = (CARD_W - pad * 2 - gap) / 2;
  const cardH = 150;

  const row1: { label: string; value: string }[] = [
    { label: "ROUNDS", value: `${data.roundsCompleted}/${data.totalRounds}` },
    { label: "RING TIME", value: `${data.durationMin}m` },
  ];

  const row2: { label: string; value: string }[] = [];
  if (data.punchesThrown && data.punchesThrown > 0) {
    row2.push({ label: "THROWN", value: String(data.punchesThrown) });
  }
  if (data.caloriesEstimate && data.caloriesEstimate > 0) {
    row2.push({ label: "BURNED", value: `~${data.caloriesEstimate}` });
  }
  if (row2.length < 2) {
    row2.push({ label: "XP EARNED", value: `+${data.xpEarned}` });
  }
  if (row2.length < 2 && data.streakCurrent > 0) {
    row2.push({ label: "DAY STREAK", value: String(data.streakCurrent) });
  }
  if (row2.length < 2) {
    row2.push({ label: "XP EARNED", value: `+${data.xpEarned}` });
  }

  const allStats = [...row1, ...row2.slice(0, 2)];
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sx = pad + col * (cardW + gap);
    const sy = y + row * (cardH + gap);
    drawStatCard(ctx, sx, sy, cardW, cardH, allStats[i].value, allStats[i].label);
  }
  y += (cardH + gap) * 2 + 40;

  // ─── XP Progress group (below stat cards) ───
  if (data.currentXP !== undefined && data.xpForNextLevel !== undefined) {
    const barX = pad;
    const barW = CARD_W - pad * 2;
    const barH = 14;
    const progress = Math.min(1, (data.progressPercent ?? 0) / 100);

    // Progress bar
    drawRoundedRect(ctx, barX, y, barW, barH, barH / 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fill();

    if (progress > 0) {
      const fillW = Math.max(barH, barW * progress);
      drawRoundedRect(ctx, barX, y, fillW, barH, barH / 2);
      const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      barGrad.addColorStop(0, "#00e5ff");
      barGrad.addColorStop(1, "#0090ff");
      ctx.fillStyle = barGrad;
      ctx.fill();
    }

    // "718 / 1,200 XP to Level 4"
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.font = `400 22px ${FONT}`;
    ctx.fillText(
      `${data.currentXP.toLocaleString()} / ${data.xpForNextLevel.toLocaleString()} XP to Level ${data.level + 1}`,
      CARD_W / 2, y + barH + 30,
    );
  }

  // ─── Bottom branding (safe zone: above story reply bar) ───
  // Story overlays cover bottom ~150px, so our safe floor is ~CARD_H - 180
  ctx.textAlign = "center";

  // Streak (if active)
  if (data.streakCurrent > 1) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = `600 26px ${FONT}`;
    ctx.fillText(`🔥 ${data.streakCurrent} day streak`, CARD_W / 2, CARD_H - 340);
  }

  // "FIGHTERS DON'T QUIT" - motivational tagline
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = `600 22px ${FONT}`;
  ctx.letterSpacing = "5px";
  ctx.fillText("FIGHTERS DON'T QUIT", CARD_W / 2 + 3, CARD_H - 270);
  ctx.letterSpacing = "0px";

  // "JAB" - large brand mark (the thing we want viewers to remember)
  ctx.fillStyle = "#00e5ff";
  ctx.font = `800 56px ${FONT}`;
  ctx.letterSpacing = "12px";
  ctx.fillText("JAB", CARD_W / 2 + 6, CARD_H - 200);
  ctx.letterSpacing = "0px";

  // @handle - what to search for
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = `400 20px ${FONT}`;
  ctx.fillText("@getjabapp", CARD_W / 2, CARD_H - 160);

  return canvasToBlob(canvas);
}

export async function shareWorkoutCard(
  data: ShareCardData,
): Promise<void> {
  const blob = await generateShareCard(data);
  const file = new File([blob], "jab-workout.png", { type: "image/png" });

  const parts = [`${data.workoutTitle}`, `${data.roundsCompleted}/${data.totalRounds} rounds`];
  if (data.punchesThrown) parts.push(`${data.punchesThrown} punches thrown`);
  if (data.caloriesEstimate) parts.push(`~${data.caloriesEstimate} cal burned`);
  parts.push(`Level ${data.level} ${data.title}`);
  const shareText = parts.join(" | ") + " | @getjabapp";

  await shareOrDownload(file, shareText, "jab-workout.png");
}

// ─── PR Share Card ───

export interface PRShareCardData {
  prLabel: string;
  prUnit: string;
  value: number;
  previousValue?: number;
  level: number;
  title: BoxingTitle;
  displayName?: string;
}

export async function generatePRCard(
  data: PRShareCardData,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;

  // ─── Background ───
  drawCardBackground(ctx);

  // ─── Display Name ───
  let nameOffset = 0;
  if (data.displayName) {
    drawDisplayName(ctx, data.displayName);
    nameOffset = 20;
  }

  // ─── "NEW PERSONAL RECORD" headline ───
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 229, 255, 0.7)";
  ctx.font = `700 28px ${FONT}`;
  ctx.letterSpacing = "8px";
  ctx.fillText("NEW PERSONAL RECORD", CARD_W / 2 + 4, 220 + nameOffset);
  ctx.letterSpacing = "0px";

  // ─── PR Label ───
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 56px ${FONT}`;
  const labelLines = wrapText(ctx, data.prLabel, CARD_W - 160);
  let labelY = 310 + nameOffset;
  for (const line of labelLines) {
    ctx.fillText(line, CARD_W / 2, labelY);
    labelY += 70;
  }

  // ─── PR Value (large, cyan) ───
  const valueY = labelY + 100;
  ctx.fillStyle = "#00e5ff";
  ctx.font = `800 120px ${FONT}`;
  const valueStr = data.value.toLocaleString();
  ctx.fillText(valueStr, CARD_W / 2, valueY);

  // Unit label
  if (data.prUnit) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = `600 36px ${FONT}`;
    ctx.fillText(data.prUnit, CARD_W / 2, valueY + 50);
  }

  // ─── Improvement delta ───
  let deltaY = valueY + (data.prUnit ? 110 : 70);
  if (data.previousValue !== undefined && data.previousValue < data.value) {
    const delta = data.value - data.previousValue;
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = `400 28px ${FONT}`;
    ctx.fillText(`Previously: ${data.previousValue.toLocaleString()} ${data.prUnit}`, CARD_W / 2, deltaY);

    ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
    ctx.font = `700 32px ${FONT}`;
    ctx.fillText(`+${delta.toLocaleString()} improvement`, CARD_W / 2, deltaY + 48);
    deltaY += 96;
  }

  // ─── Level Badge ───
  const badgeY = Math.max(deltaY + 60, CARD_H - 380);
  drawLevelBadge(ctx, data.level, data.title, badgeY);

  // ─── Footer ───
  drawCardFooter(ctx);

  return canvasToBlob(canvas);
}

export async function sharePRCard(
  data: PRShareCardData,
): Promise<void> {
  const blob = await generatePRCard(data);
  const file = new File([blob], "jab-pr.png", { type: "image/png" });
  const shareText = `New Personal Record: ${data.prLabel} - ${data.value} ${data.prUnit} | Level ${data.level} ${data.title} | @getjabapp`;

  await shareOrDownload(file, shareText, "jab-pr.png");
}

// ─── Level-Up Share Card ───

export interface LevelUpShareCardData {
  level: number;
  title: BoxingTitle;
  totalXP: number;
  displayName?: string;
}

export async function generateLevelUpCard(
  data: LevelUpShareCardData,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;

  // ─── Background (amplified cyan glow for celebration) ───
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Centered cyan glow - stronger for celebration
  const glowCenter = ctx.createRadialGradient(CARD_W / 2, CARD_H / 2 - 100, 0, CARD_W / 2, CARD_H / 2 - 100, 600);
  glowCenter.addColorStop(0, "rgba(0, 229, 255, 0.18)");
  glowCenter.addColorStop(1, "rgba(0, 229, 255, 0)");
  ctx.fillStyle = glowCenter;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Red accent glow - bottom
  const glowBot = ctx.createRadialGradient(CARD_W / 2, CARD_H - 200, 0, CARD_W / 2, CARD_H - 200, 400);
  glowBot.addColorStop(0, "rgba(255, 60, 40, 0.08)");
  glowBot.addColorStop(1, "rgba(255, 60, 40, 0)");
  ctx.fillStyle = glowBot;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Corner accent lines
  drawCornerAccents(ctx);

  // ─── Display Name ───
  let nameOffset = 0;
  if (data.displayName) {
    drawDisplayName(ctx, data.displayName);
    nameOffset = 20;
  }

  // ─── "RANKED UP" headline ───
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 229, 255, 0.7)";
  ctx.font = `700 34px ${FONT}`;
  ctx.letterSpacing = "10px";
  ctx.fillText("RANKED UP", CARD_W / 2 + 5, 230 + nameOffset);
  ctx.letterSpacing = "0px";

  // ─── Large level circle ───
  const circleY = 450 + nameOffset;
  const circleR = 90;

  // Outer glow
  const circleGlow = ctx.createRadialGradient(CARD_W / 2, circleY, 0, CARD_W / 2, circleY, circleR + 40);
  circleGlow.addColorStop(0, "rgba(0, 229, 255, 0.3)");
  circleGlow.addColorStop(1, "rgba(0, 229, 255, 0)");
  ctx.fillStyle = circleGlow;
  ctx.fillRect(CARD_W / 2 - 150, circleY - 150, 300, 300);

  // Circle background
  ctx.beginPath();
  ctx.arc(CARD_W / 2, circleY, circleR, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 229, 255, 0.08)";
  ctx.fill();
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Level number
  ctx.fillStyle = "#00e5ff";
  ctx.font = `800 90px ${FONT}`;
  ctx.fillText(String(data.level), CARD_W / 2, circleY + 32);

  // ─── Boxing Title ───
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 64px ${FONT}`;
  ctx.fillText(data.title, CARD_W / 2, circleY + circleR + 80);

  // ─── "Level N" subtitle ───
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = `500 36px ${FONT}`;
  ctx.fillText(`Level ${data.level}`, CARD_W / 2, circleY + circleR + 130);

  // ─── Total XP ───
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.font = `400 28px ${FONT}`;
  ctx.fillText(`${data.totalXP.toLocaleString()} XP earned`, CARD_W / 2, circleY + circleR + 180);

  // ─── Footer ───
  drawCardFooter(ctx);

  return canvasToBlob(canvas);
}

export async function shareLevelUpCard(
  data: LevelUpShareCardData,
): Promise<void> {
  const blob = await generateLevelUpCard(data);
  const file = new File([blob], "jab-level-up.png", { type: "image/png" });
  const shareText = `Ranked up to ${data.title} (Level ${data.level}) | ${data.totalXP.toLocaleString()} XP | @getjabapp`;

  await shareOrDownload(file, shareText, "jab-level-up.png");
}

// ─── Shared drawing helpers ───

function drawCardBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const glowTopLeft = ctx.createRadialGradient(200, 250, 0, 200, 250, 500);
  glowTopLeft.addColorStop(0, "rgba(255, 60, 40, 0.12)");
  glowTopLeft.addColorStop(1, "rgba(255, 60, 40, 0)");
  ctx.fillStyle = glowTopLeft;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const glowTopRight = ctx.createRadialGradient(CARD_W - 200, 300, 0, CARD_W - 200, 300, 500);
  glowTopRight.addColorStop(0, "rgba(0, 229, 255, 0.10)");
  glowTopRight.addColorStop(1, "rgba(0, 229, 255, 0)");
  ctx.fillStyle = glowTopRight;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const glowBot = ctx.createRadialGradient(CARD_W / 2, CARD_H - 300, 0, CARD_W / 2, CARD_H - 300, 500);
  glowBot.addColorStop(0, "rgba(0, 144, 255, 0.08)");
  glowBot.addColorStop(1, "rgba(0, 144, 255, 0)");
  ctx.fillStyle = glowBot;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  drawCornerAccents(ctx);
}

function drawCornerAccents(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = "rgba(255, 60, 40, 0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 100); ctx.lineTo(100, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 140); ctx.lineTo(140, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CARD_W, CARD_H - 100); ctx.lineTo(CARD_W - 100, CARD_H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CARD_W, CARD_H - 140); ctx.lineTo(CARD_W - 140, CARD_H); ctx.stroke();
}

function drawDisplayName(ctx: CanvasRenderingContext2D, name: string) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText(name.toUpperCase(), CARD_W / 2, 150);

  const nameLineGrad = ctx.createLinearGradient(CARD_W / 2 - 160, 0, CARD_W / 2 + 160, 0);
  nameLineGrad.addColorStop(0, "rgba(255, 60, 40, 0)");
  nameLineGrad.addColorStop(0.5, "rgba(255, 60, 40, 0.4)");
  nameLineGrad.addColorStop(1, "rgba(255, 60, 40, 0)");
  ctx.strokeStyle = nameLineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CARD_W / 2 - 160, 172);
  ctx.lineTo(CARD_W / 2 + 160, 172);
  ctx.stroke();
}

function drawLevelBadge(ctx: CanvasRenderingContext2D, level: number, title: BoxingTitle, y: number) {
  const circleR = 44;
  const circleX = CARD_W / 2 - 130;

  const circleGlow = ctx.createRadialGradient(circleX, y, 0, circleX, y, circleR + 20);
  circleGlow.addColorStop(0, "rgba(0, 229, 255, 0.3)");
  circleGlow.addColorStop(1, "rgba(0, 229, 255, 0)");
  ctx.fillStyle = circleGlow;
  ctx.fillRect(circleX - 80, y - 80, 160, 160);

  ctx.beginPath();
  ctx.arc(circleX, y, circleR, 0, Math.PI * 2);
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#00e5ff";
  ctx.font = `800 40px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(String(level), circleX, y + 14);

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 40px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText(title, circleX + circleR + 24, y + 14);
}

function drawCardFooter(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.font = `600 26px ${FONT}`;
  ctx.letterSpacing = "4px";
  ctx.fillText("FIGHTERS DON'T QUIT", CARD_W / 2 + 2, CARD_H - 130);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "rgba(0, 229, 255, 0.4)";
  ctx.font = `600 24px ${FONT}`;
  ctx.letterSpacing = "2px";
  ctx.fillText("JAB", CARD_W / 2 + 1, CARD_H - 70);
  ctx.letterSpacing = "0px";
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate share card"));
      },
      "image/png",
    );
  });
}

async function shareOrDownload(file: File, _shareText: string, filename: string): Promise<void> {
  // On native iOS, use Capacitor's native share
  if (Capacitor.isNativePlatform()) {
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Write to a timestamped path to avoid caching issues
      const timestampedName = `jab-${Date.now()}.png`;
      const result = await Filesystem.writeFile({
        path: timestampedName,
        data: base64,
        directory: Directory.Cache,
      });

      // Get the full file:// URI for sharing
      const uriResult = await Filesystem.getUri({
        path: timestampedName,
        directory: Directory.Cache,
      });

      await Share.share({
        files: [uriResult.uri],
      });
      return;
    } catch (e) {
      if (e instanceof Error && (e.name === "AbortError" || e.message?.includes("User cancelled"))) return;
      return;
    }
  }

  // Web/PWA: use navigator.share
  if (navigator.share) {
    // Check file sharing support first
    const canShareFiles = navigator.canShare?.({ files: [file] });
    if (canShareFiles) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        // User gesture may have expired from async canvas generation.
        // Fall through to open image directly.
      }
    }
  }

  // Fallback: open image in new tab so user can long-press to save
  const url = URL.createObjectURL(file);
  window.open(url, "_blank");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
