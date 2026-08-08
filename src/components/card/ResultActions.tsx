"use client";

import { useState } from "react";
import { Download, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import XLogo from "@/components/icons/XLogo";
import type { BuilderData } from "@/lib/types";
import { downloadCardPng, shareCardWithClipboardAndDownload } from "@/lib/share";

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
  const [sharing, setSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function handleDownload() {
    if (downloading || sharing) return;
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

  async function handleShare() {
    if (sharing || downloading) return;
    setSharing(true);
    setToastMessage(null);
    try {
      onCapturingChange(true);
      await nextFrame();
      await nextFrame(); // let the plain-text (non-editable) card paint before capture
      const node = cardRef.current;
      if (node) {
        const { copied } = await shareCardWithClipboardAndDownload(node, data);
        if (copied) {
          setToastMessage("Card image copied! Press Ctrl+V (Cmd+V) in Twitter to paste it.");
        } else {
          setToastMessage("Card image downloaded! Attach it to your tweet on Twitter.");
        }
      }
    } finally {
      onCapturingChange(false);
      setSharing(false);
    }
  }

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-3">
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-goa-gold/40 bg-black/70 px-3 py-2 text-center font-mono text-[11px] text-goa-gold backdrop-blur-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Button type="button" size="lg" className="w-full" onClick={handleDownload} disabled={downloading || sharing}>
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
          disabled={downloading || sharing}
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" /> Generate Another
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 flex-1 px-2 text-[11px] sm:text-xs"
          onClick={handleShare}
          disabled={downloading || sharing}
        >
          <XLogo className="h-3 w-3 shrink-0" /> {sharing ? "Sharing…" : "Share on X"}
        </Button>
      </div>
    </div>
  );
}
