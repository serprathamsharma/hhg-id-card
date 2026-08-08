import type { CSSProperties } from "react";
import type { Rarity } from "@/lib/types";

export interface CardTheme {
  bg: string;
  ink: string;
  /** Secondary/label text — verified >= 4.5:1 contrast against `bg`. */
  inkSecondary: string;
  accent: string;
  accentSoft: string;
  border: string;
  /** QR quiet-zone background — matches/blends with the theme instead of a stark white box. */
  qrPanelBg: string;
  qrFg: string;
  pattern: CSSProperties;
}

const paperGrain: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
  backgroundSize: "18px 18px, 26px 26px",
  backgroundPosition: "0 0, 9px 13px",
};

const blueprintGrid: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(26,63,143,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(26,63,143,0.14) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const travelLines: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(115deg, rgba(47,107,60,0.07) 0px, rgba(47,107,60,0.07) 2px, transparent 2px, transparent 26px)",
};

const foilShimmer: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(65deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 30px)",
};

// Kept deliberately faint per spec: "grid pattern opacity does not compromise text contrast".
const metallicLines: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(65deg, rgba(212,175,55,0.09) 0px, rgba(212,175,55,0.09) 1px, transparent 1px, transparent 26px)",
};

/**
 * Classic collectible-rarity ladder (common → legendary), each verified
 * against WCAG contrast for `inkSecondary` on `bg` (all ≥ 6.6:1, spec floor
 * is 4.5:1). Common/rare/legendary match the brief's crimson/cobalt/charcoal
 * spec directly; uncommon and epic are the conventional in-between steps
 * (green, purple) rendered with the same refined system.
 */
export const CARD_THEMES: Record<Rarity, CardTheme> = {
  common: {
    bg: "#f1e6cd",
    ink: "#241a12",
    inkSecondary: "#5c4a35",
    accent: "#7c1a1f",
    accentSoft: "rgba(124,26,31,0.3)",
    border: "#7c1a1f",
    qrPanelBg: "#f1e6cd",
    qrFg: "#241a12",
    pattern: paperGrain,
  },
  uncommon: {
    bg: "#eef1e2",
    ink: "#1c2a1c",
    inkSecondary: "#3f5a3f",
    accent: "#2f6b3c",
    accentSoft: "rgba(47,107,60,0.32)",
    border: "#2f6b3c",
    qrPanelBg: "#eef1e2",
    qrFg: "#1c2a1c",
    pattern: { ...paperGrain, ...travelLines },
  },
  rare: {
    bg: "#e6edf7",
    ink: "#101b2e",
    inkSecondary: "#3a4f6b",
    accent: "#1a3f8f",
    accentSoft: "rgba(26,63,143,0.32)",
    border: "#1a3f8f",
    qrPanelBg: "#e6edf7",
    qrFg: "#101b2e",
    pattern: blueprintGrid,
  },
  epic: {
    bg: "#ece1f5",
    ink: "#231433",
    inkSecondary: "#4a3560",
    accent: "#5b2a86",
    accentSoft: "rgba(91,42,134,0.34)",
    border: "#5b2a86",
    qrPanelBg: "#ece1f5",
    qrFg: "#231433",
    pattern: { ...paperGrain, ...foilShimmer },
  },
  legendary: {
    bg: "#1c1f22",
    ink: "#f3ead0",
    inkSecondary: "#c7b998",
    accent: "#d4af37",
    accentSoft: "rgba(212,175,55,0.35)",
    border: "#d4af37",
    qrPanelBg: "#efe6c8",
    qrFg: "#1c1f22",
    pattern: metallicLines,
  },
};
