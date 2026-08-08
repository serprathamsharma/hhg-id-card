"use client";

import { useState } from "react";
import { Download, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import XLogo from "@/components/icons/XLogo";
import type { BuilderData } from "@/lib/types";
import { downloadCardPng, getShareUrl, processCardExport } from "@/lib/share";

interface ResultActionsProps {
  data: BuilderData;
  cardRef: React.RefObject<HTMLDivElement>;
  onReset: () => void;
  /** Toggles BuilderCard's editable inputs off so the exported PNG shows plain
   *  text instead of the on-screen pencil/dashed-underline edit affordances. */
  onCapturingChange: (capturing: boolean) => void;
}

const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve));

export default function ResultActions({ data, cardRef, onReset, onCapturingChange }: ResultActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      onCapturingChange(true);
      await nextFrame();
      await nextFrame(); // let the plain-text (non-editable) card paint before capture
      const node = cardRef.current;
      if (node) await downloadCardPng(node, `hacker-house-goa-${data.builderId}.png`);
    } finally {
      onCapturingChange(false);
      setDownloading(false);
    }
  }

  async function handleShareClick() {
    try {
      onCapturingChange(true);
      await nextFrame();
      await nextFrame();
      const node = cardRef.current;
      if (node) {
        const { copied } = await processCardExport(node, `hacker-house-goa-${data.builderId}.png`);
        if (copied) {
          setToastMessage("Card copied to clipboard! Press Ctrl+V (Cmd+V) to paste into Twitter.");
        } else {
          setToastMessage("Card downloaded! Attach it to your tweet.");
        }
      }
    } catch (err) {
      console.warn("Share click capture error:", err);
    } finally {
      onCapturingChange(false);
    }
  }

  const shareUrl = getShareUrl(data);

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-3">
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-goa-gold/40 bg-black/70 px-3 py-2 text-center font-mono text-[11px] text-goa-gold backdrop-blur-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Button type="button" size="lg" className="w-full" onClick={handleDownload} disabled={downloading}>
        <Download className="h-4 w-4" strokeWidth={2.5} />
        {downloading ? "Preparing…" : "Download PNG"}
      </Button>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 flex-1 px-2 text-[11px] sm:text-xs"
          onClick={onReset}
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" /> Generate Another
        </Button>

        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareClick}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2 py-2 text-[11px] font-bold text-white transition-colors hover:bg-white/10 sm:text-xs"
        >
          <XLogo className="h-3 w-3 shrink-0" /> Share on X
        </a>
      </div>
    </div>
  );
}
