import { toPng, toBlob } from "html-to-image";
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
  return `I just got ${labelForRarity(data.rarity)} – ${data.title} 🔥\n\nWhat's your Builder identity?\n\n📌 (Press Ctrl+V / Cmd+V to paste your ID card image!)\n\n#FrameInGoa #HHGoa2026`;
}

export function getShareUrl(data: BuilderData) {
  const text = buildShareText(data);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export async function copyCardToClipboard(node: HTMLElement) {
  try {
    const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
    if (blob && typeof navigator !== "undefined" && navigator.clipboard && typeof ClipboardItem !== "undefined") {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      return true;
    }
  } catch (err) {
    console.warn("Could not copy card to clipboard:", err);
  }
  return false;
}
