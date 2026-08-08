import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Pencil } from "lucide-react";
import type { BuilderData } from "@/lib/types";
import { CARD_THEMES } from "./themes";
import { labelForRarity } from "@/lib/generate";
import StarRow from "./StarRow";
import Barcode from "./Barcode";
import PalmMark from "./PalmMark";
import ConchMark from "./ConchMark";

export const CARD_WIDTH = 520;
export const CARD_HEIGHT = 660;

interface BuilderCardProps {
  data: BuilderData;
  editable?: boolean;
  onNameChange?: (name: string) => void;
}

/**
 * 4-zone layout: Header (branding) → Hero (photo + scannable QR stack) →
 * Metadata (name / title / location, filling what used to be dead space) →
 * Footer (hashtag + rarity). Layout is identical across rarities — only
 * `CARD_THEMES` tokens change.
 */
const BuilderCard = forwardRef<HTMLDivElement, BuilderCardProps>(
  ({ data, editable = false, onNameChange }, ref) => {
    const theme = CARD_THEMES[data.rarity];

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-[20px] font-jetbrains"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: theme.bg,
          border: `3px solid ${theme.border}`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
          color: theme.ink,
        }}
      >
        <div className="pointer-events-none absolute inset-0" style={theme.pattern} />

        {/* left date spine — centered independently of content padding */}
        <div
          className="absolute left-0 top-0 flex h-full w-[42px] items-center justify-center"
          style={{ background: theme.accent }}
        >
          <span
            className="whitespace-nowrap text-[13px] font-bold tracking-[0.18em] text-white"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {data.dates}
          </span>
        </div>

        <div className="relative flex h-full flex-col pb-6 pl-[62px] pr-6 pt-6">
          {/* ── Header zone ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="leading-[1.05]">
              <div className="text-[11px] font-bold tracking-wide">2:47 PM</div>
              <div className="text-[11px] font-bold tracking-[0.15em]">STUDIO</div>
            </div>

            <div className="flex items-baseline gap-[6px] font-sans text-[19px] font-extrabold uppercase leading-none tracking-tight">
              <span>HACKER</span>
              <span
                className="translate-y-[1px] font-devanagari text-[0.95em] leading-none"
                style={{ color: theme.accent }}
                lang="hi"
              >
                गोवा
              </span>
              <span>HOUSE</span>
            </div>

            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ border: `2px solid ${theme.accent}` }}
            >
              <PalmMark className="h-4 w-4" color={theme.accent} />
            </div>
          </div>

          <div className="mt-3 h-px w-full" style={{ background: theme.accentSoft }} />

          {/* ── Hero zone: photo | QR stack ──────────────────────────── */}
          <div className="mt-4 flex gap-4">
            <div
              className="w-[190px] shrink-0 overflow-hidden rounded-[6px]"
              style={{ aspectRatio: "4 / 5", border: `3px solid ${theme.ink}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.photo} alt="" className="h-full w-full object-cover grayscale" />
            </div>

            <div className="flex flex-1 flex-col">
              <div
                className="text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: theme.inkSecondary }}
              >
                Builder Pass
              </div>

              <div
                className="mt-2 flex items-center justify-center rounded-[10px] p-2.5"
                style={{ background: theme.qrPanelBg, boxShadow: `inset 0 0 0 1px ${theme.accentSoft}` }}
              >
                <QRCodeSVG
                  value={data.builderId}
                  size={124}
                  fgColor={theme.qrFg}
                  bgColor={theme.qrPanelBg}
                  level="M"
                  className="h-auto w-full"
                />
              </div>

              <div className="mt-2.5">
                <Barcode seed={data.builderId} color={theme.ink} />
              </div>

              <div className="mt-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.inkSecondary }}>
                  Builder ID
                </div>
                <div className="mt-[2px] text-[14px] font-bold tracking-wider">{data.builderId}</div>
              </div>
            </div>
          </div>

          {/* ── Metadata zone: fills the middle, no more dead space ──── */}
          <div className="mt-5 flex flex-1 flex-col justify-center gap-4">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: theme.inkSecondary }}>
                Name
              </div>
              {editable ? (
                <div className="relative mt-1">
                  <input
                    value={data.name}
                    onChange={(e) => onNameChange?.(e.target.value.toUpperCase().slice(0, 22))}
                    placeholder="YOUR NAME"
                    aria-label="Your name — tap to edit"
                    className="w-full border-b border-dashed bg-transparent py-0.5 pr-5 font-sans text-[24px] font-extrabold uppercase leading-[1.05] tracking-tight outline-none placeholder:opacity-40"
                    style={{ color: theme.ink, borderColor: theme.accentSoft }}
                  />
                  <Pencil
                    className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2"
                    style={{ color: theme.inkSecondary }}
                  />
                </div>
              ) : (
                <div className="mt-1 font-sans text-[24px] font-extrabold uppercase leading-[1.05] tracking-tight">
                  {data.name}
                </div>
              )}
            </div>

            <div className="flex gap-6 border-t pt-4" style={{ borderColor: theme.accentSoft }}>
              <div className="flex-1">
                <div
                  className="text-[9px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: theme.inkSecondary }}
                >
                  Builder Title
                </div>
                <div className="mt-1 text-[15px] font-bold uppercase tracking-wide" style={{ color: theme.accent }}>
                  {data.title}
                </div>
              </div>
              <div className="flex-1">
                <div
                  className="text-[9px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: theme.inkSecondary }}
                >
                  Location
                </div>
                <div className="mt-1 text-[15px] font-bold uppercase tracking-wide">{data.location}</div>
              </div>
            </div>
          </div>

          {/* ── Footer zone ───────────────────────────────────────────── */}
          <div className="mt-2 flex items-center justify-between border-t pt-3" style={{ borderColor: theme.accentSoft }}>
            <div className="flex items-center gap-[6px] text-[11px]">
              <ConchMark className="h-3.5 w-3.5" color={theme.accent} />
              <span className="font-bold tracking-wide">#FrameInGoa</span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: theme.inkSecondary }}>
                Rarity
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-[3px] px-2 py-[3px] text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ background: theme.ink, color: theme.bg }}
                >
                  {labelForRarity(data.rarity)}
                </span>
                <StarRow count={data.starCount} color={theme.accent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BuilderCard.displayName = "BuilderCard";

export default BuilderCard;
