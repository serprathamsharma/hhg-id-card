import type { BuilderData, Rarity } from "./types";

export const DEFAULT_NAME = "GOA BUILDER";
export const EVENT_DATES = "28 – 31 OCT 2026";
export const EVENT_LOCATION = "GOA, INDIA";

/** Rarity odds — must sum to 100. */
const RARITY_WEIGHTS: { rarity: Rarity; weight: number }[] = [
  { rarity: "common", weight: 40 },
  { rarity: "uncommon", weight: 27 },
  { rarity: "rare", weight: 18 },
  { rarity: "epic", weight: 10 },
  { rarity: "legendary", weight: 5 },
];

const RARITY_TITLES: Record<Rarity, string[]> = {
  common: ["Bug Hunter", "Night Owl", "Keyboard Warrior", "Code Explorer", "Coffee Powered"],
  uncommon: ["API Alchemist", "Pixel Crafter", "Stack Navigator", "Backend Builder", "Frontend Ninja"],
  rare: ["Full Stack Wizard", "Ship Master", "Context Engineer", "Merge Master", "Prompt Architect"],
  epic: ["Hackathon Beast", "Infinite Context", "Merge Machine", "Repo Whisperer", "Architecture Wizard"],
  legendary: ["Founder Material", "Zero Downtime", "Terminal Overlord", "Chaos Engineer", "Goa Champion"],
};

const RARITY_STARS: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
};

const RARITY_LABEL: Record<Rarity, string> = {
  common: "COMMON",
  uncommon: "UNCOMMON",
  rare: "RARE",
  epic: "EPIC",
  legendary: "LEGENDARY",
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rollRarity(): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const { rarity, weight } of RARITY_WEIGHTS) {
    cumulative += weight;
    if (roll < cumulative) return rarity;
  }
  return "common";
}

export function rollTitle(rarity: Rarity): string {
  return pick(RARITY_TITLES[rarity]);
}

export function starsForRarity(rarity: Rarity): number {
  return RARITY_STARS[rarity];
}

export function labelForRarity(rarity: Rarity): string {
  return RARITY_LABEL[rarity];
}

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

/** Generates an ID shaped like HH26-A8F2K9 */
export function generateBuilderId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return `HH26-${suffix}`;
}

/** Rolls a fresh rarity + title + id for a newly-generated Builder Card. */
export function createBuilderData(photo: string, name = DEFAULT_NAME): BuilderData {
  const rarity = rollRarity();
  return {
    name,
    photo,
    rarity,
    title: rollTitle(rarity),
    builderId: generateBuilderId(),
    starCount: starsForRarity(rarity),
    dates: EVENT_DATES,
    location: EVENT_LOCATION,
  };
}
