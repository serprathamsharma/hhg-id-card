"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Pencil, ZoomIn } from "lucide-react";
import type { BuilderData } from "@/lib/types";
import { CARD_THEMES } from "./themes";
import { labelForRarity } from "@/lib/generate";
import type { Focus } from "@/lib/faceCrop";
import StarRow from "./StarRow";
import PalmMark from "./PalmMark";
import ConchMark from "./ConchMark";

export const CARD_WIDTH = 520;
export const CARD_HEIGHT = 660;

// Photo frame dimensions within the card (matches the 190px / 4:5 layout)
const PHOTO_W = 190;
const PHOTO_H = PHOTO_W * (5 / 4); // 237.5

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

interface BuilderCardProps {
  data: BuilderData;
  editable?: boolean;
  onNameChange?: (name: string) => void;
  // Inline photo-repositioning props (optional — absent = static display)
  sourceImg?: HTMLImageElement | null;
  focus?: Focus;
  zoom?: number;
  scale?: number; // CSS scale factor applied by CardStage
  onFocusChange?: (f: Focus) => void;
  onZoomChange?: (z: number) => void;
  onDragEnd?: () => void;
  isCapturing?: boolean;
}

/**
 * 4-zone layout: Header (branding) → Hero (photo + scannable QR stack) →
 * Metadata (name / title / location, filling what used to be dead space) →
 * Footer (hashtag + rarity). Layout is identical across rarities — only
 * `CARD_THEMES` tokens change.
 */
const BuilderCard = forwardRef<HTMLDivElement, BuilderCardProps>(
  (
    {
      data,
      editable = false,
      onNameChange,
      sourceImg,
      focus,
      zoom = 1,
      scale = 1,
      onFocusChange,
      onZoomChange,
      onDragEnd,
      isCapturing = false,
    },
    ref
  ) => {
    const theme = CARD_THEMES[data.rarity];
    const dragRef = useRef<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Live CSS-transform values for the photo preview
    const isInteractive = !!(sourceImg && focus && onFocusChange);

    const baseScale = isInteractive
      ? Math.max(PHOTO_W / sourceImg!.naturalWidth, PHOTO_H / sourceImg!.naturalHeight)
      : 1;
    const dw = isInteractive ? Math.ceil(sourceImg!.naturalWidth * baseScale * zoom) : 0;
    const dh = isInteractive ? Math.ceil(sourceImg!.naturalHeight * baseScale * zoom) : 0;
    const tx = isInteractive ? clamp(PHOTO_W / 2 - focus!.x * dw, PHOTO_W - dw, 0) : 0;
    const ty = isInteractive ? clamp(PHOTO_H / 2 - focus!.y * dh, PHOTO_H - dh, 0) : 0;

    const onPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!isInteractive) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        dragRef.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        setHasInteracted(true);
      },
      [isInteractive]
    );

    const onPointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragRef.current || !isInteractive) return;
        // Pointer deltas are in screen pixels; divide by scale to get card-space pixels
        const dx = (e.clientX - dragRef.current.x) / scale;
        const dy = (e.clientY - dragRef.current.y) / scale;
        dragRef.current = { x: e.clientX, y: e.clientY };
        onFocusChange!({
          x: clamp(focus!.x - dx / dw, 0, 1),
          y: clamp(focus!.y - dy / dh, 0, 1),
        });
      },
      [isInteractive, scale, focus, dw, dh, onFocusChange]
    );

    const onPointerUp = useCallback(() => {
      if (!dragRef.current) return;
      dragRef.current = null;
      setIsDragging(false);
      onDragEnd?.();
    }, [onDragEnd]);

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
          className="absolute left-0 top-0 flex h-full w-[50px] items-center justify-center"
          style={{ background: theme.accent }}
        >
          <span
            className="whitespace-nowrap text-[16px] font-bold tracking-[0.22em] text-white"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg) scaleX(1.25)" }}
          >
            {data.dates}
          </span>
        </div>

        <div className="relative flex h-full flex-col pb-6 pl-[68px] pr-6 pt-6">
          {/* ── Header zone ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studio_logo.png"
              alt="2:47PM STUDIO"
              className="h-8 w-auto object-contain -translate-y-[6px]"
              style={{ filter: "grayscale(1) brightness(0)", clipPath: "inset(1px 0 0 0)" }}
            />

            <div className="flex items-baseline gap-[6px] font-sans text-[26px] font-extrabold uppercase leading-none tracking-tight">
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
            {/* Photo frame — interactive when sourceImg is provided */}
            <div
              className="relative shrink-0 overflow-hidden rounded-[6px]"
              style={{
                width: PHOTO_W,
                aspectRatio: "4 / 5",
                border: `3px solid ${theme.ink}`,
                cursor: isInteractive && !isCapturing ? (isDragging ? "grabbing" : "grab") : "default",
                touchAction: "none",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {isInteractive ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sourceImg!.src}
                    alt=""
                    draggable={false}
                    className="absolute select-none grayscale"
                    style={{
                      width: dw,
                      height: dh,
                      transform: `translate(${tx}px, ${ty}px)`,
                      willChange: "transform",
                    }}
                  />

                  {/* Drag hint — fades out after first interaction or during capture */}
                  {!hasInteracted && !isCapturing && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-start gap-1 pt-2">
                      <div
                        className="rounded-md px-2 py-1 text-center font-mono text-[9px] font-bold uppercase tracking-wider text-white"
                        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
                      >
                        Drag to reposition
                      </div>
                    </div>
                  )}

                  {/* Zoom slider — always visible in interactive mode, hidden during capture */}
                  {onZoomChange && !isCapturing && (
                    <div
                      className="pointer-events-auto absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-lg px-2 py-1"
                      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", width: "90%" }}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <ZoomIn className="h-3 w-3 shrink-0 text-white/70" />
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                        className="w-full accent-white"
                        aria-label="Zoom"
                        onPointerUp={onDragEnd}
                      />
                    </div>
                  )}
                </>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={data.photo} alt="" className="h-full w-full object-cover grayscale" />
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <div
                className="text-[12px] font-bold uppercase tracking-[0.22em] text-center"
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

              <div className="mt-3 text-center">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.inkSecondary }}>
                  Builder ID
                </div>
                <div className="mt-[3px] text-[16px] font-bold tracking-wider">{data.builderId}</div>
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
          <div className="mt-2 flex items-center justify-between border-t pt-6 pb-0" style={{ borderColor: theme.accentSoft }}>
            <div className="flex items-center gap-2.5 text-[20px]">
              <ConchMark className="h-7 w-7" color={theme.accent} />
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
