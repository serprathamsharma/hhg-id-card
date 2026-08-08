"use client";

import { useMemo, useRef, useState } from "react";
import { X, Check, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { renderCroppedPhoto, type Focus } from "@/lib/faceCrop";
import { PHOTO_ASPECT, PHOTO_TARGET } from "@/lib/constants";

const FRAME_W = 260;
const FRAME_H = FRAME_W / PHOTO_ASPECT;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

interface ImageEditorProps {
  img: HTMLImageElement;
  initialFocus: Focus;
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageEditor({ img, initialFocus, onConfirm, onCancel }: ImageEditorProps) {
  const [focus, setFocus] = useState<Focus>(initialFocus);
  const [zoom, setZoom] = useState(1);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const baseScale = Math.max(FRAME_W / img.naturalWidth, FRAME_H / img.naturalHeight);
  const dw = img.naturalWidth * baseScale * zoom;
  const dh = img.naturalHeight * baseScale * zoom;
  const tx = clamp(FRAME_W / 2 - focus.x * dw, FRAME_W - dw, 0);
  const ty = clamp(FRAME_H / 2 - focus.y * dh, FRAME_H - dh, 0);

  const src = useMemo(() => img.src, [img]);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setFocus((f) => ({
      x: clamp(f.x - dx / dw, 0, 1),
      y: clamp(f.y - dy / dh, 0, 1),
    }));
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  function handleConfirm() {
    const dataUrl = renderCroppedPhoto(img, {
      focus,
      zoom,
      targetWidth: PHOTO_TARGET.width,
      targetHeight: PHOTO_TARGET.height,
    });
    onConfirm(dataUrl);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-black/85 px-6 backdrop-blur-sm">
      <p className="font-mono text-sm font-bold uppercase tracking-wide text-goa-gold">Reposition photo</p>

      <div
        className="relative touch-none overflow-hidden rounded-xl border-2 border-goa-gold/80 bg-black"
        style={{ width: FRAME_W, height: FRAME_H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          draggable={false}
          className="absolute select-none grayscale"
          style={{ width: dw, height: dh, transform: `translate(${tx}px, ${ty}px)` }}
        />
      </div>

      <div className="flex w-full max-w-[260px] items-center gap-3 text-goa-gold">
        <ZoomIn className="h-4 w-4 shrink-0" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full accent-goa-gold"
          aria-label="Zoom"
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" /> Cancel
        </Button>
        <Button type="button" onClick={handleConfirm}>
          <Check className="h-4 w-4" /> Use Photo
        </Button>
      </div>
    </div>
  );
}
