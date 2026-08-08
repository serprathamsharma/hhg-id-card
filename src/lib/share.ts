import { toBlob } from "html-to-image";
import type { BuilderData } from "./types";
import { labelForRarity } from "./generate";

export async function processCardExport(node: HTMLElement, filename: string) {
  // Single-pass render: generate PNG Blob once for fast performance & fresh gesture token
  const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
  if (!blob) return { copied: false };

  let copied = false;

  // 1. Copy PNG to system clipboard immediately while user gesture is active
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof ClipboardItem !== "undefined") {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      copied = true;
    } catch (err) {
      console.warn("Clipboard write error:", err);
    }
  }

  // 2. Trigger instant download via Blob URL
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

  return { copied };
}

export async function downloadCardPng(node: HTMLElement, filename: string) {
  const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
  if (!blob) return;
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function buildShareText(data: BuilderData) {
  return `I just got ${labelForRarity(data.rarity)} – ${data.title} 🔥\n\nWhat's your Builder identity?\n\n📌 (Press Ctrl+V / Cmd+V to paste your ID card image!)\n\n#FrameInGoa #HHGoa2026`;
}

export function getShareUrl(data: BuilderData) {
  const text = buildShareText(data);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
