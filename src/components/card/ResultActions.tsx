"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import XLogo from "@/components/icons/XLogo";
import type { BuilderData } from "@/lib/types";
import { downloadCardPng, getShareUrl } from "@/lib/share";

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

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-3">
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
          href={getShareUrl(data)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2 py-2 text-[11px] font-bold text-white transition-colors hover:bg-white/10 sm:text-xs"
        >
          <XLogo className="h-3 w-3 shrink-0" /> Share on X
        </a>
      </div>
    </div>
  );
}
