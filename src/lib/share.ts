import { toPng } from "html-to-image";
import type { BuilderData } from "./types";
import { labelForRarity } from "./generate";

export async function downloadCardPng(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function buildShareText(data: BuilderData) {
  return `I just got ${labelForRarity(data.rarity)} – ${data.title} 🔥\n\nWhat's your Builder identity?\n\n#FrameInGoa #HHGoa2026`;
}

export function getShareUrl(data: BuilderData) {
  const text = buildShareText(data);
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export function shareOnX(data: BuilderData) {
  const url = getShareUrl(data);
  window.open(url, "_blank", "noopener,noreferrer");
}
