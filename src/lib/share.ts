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

export async function shareCardWithClipboardAndDownload(node: HTMLElement, data: BuilderData) {
  const filename = `hacker-house-goa-${data.builderId}.png`;

  // Synchronously open window handle to prevent Chrome popup blocker
  const shareWindow = window.open("about:blank", "_blank");

  let copied = false;
  try {
    const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
    if (blob) {
      if (typeof navigator !== "undefined" && navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        copied = true;
      }
    }
  } catch (err) {
    console.warn("Could not copy card image to clipboard:", err);
  }

  try {
    await downloadCardPng(node, filename);
  } catch (err) {
    console.warn("Could not auto-download card PNG:", err);
  }

  const text = buildShareText(data);
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  if (shareWindow) {
    shareWindow.location.href = intentUrl;
  } else {
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  }

  return { copied };
}
