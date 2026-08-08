"use client";

import { useLayoutEffect, useRef, useState } from "react";
import BuilderCard, { CARD_WIDTH, CARD_HEIGHT } from "./BuilderCard";
import type { BuilderData } from "@/lib/types";
import type { Focus } from "@/lib/faceCrop";

interface CardStageProps {
  data: BuilderData;
  cardRef: React.RefObject<HTMLDivElement>;
  className?: string;
  editable?: boolean;
  onNameChange?: (name: string) => void;
  // Inline photo-repositioning props (forwarded to BuilderCard)
  sourceImg?: HTMLImageElement | null;
  focus?: Focus;
  zoom?: number;
  onFocusChange?: (f: Focus) => void;
  onZoomChange?: (z: number) => void;
  onDragEnd?: () => void;
  isCapturing?: boolean;
}

/** Renders the fixed-resolution BuilderCard scaled to fit its container. */
export default function CardStage({
  data,
  cardRef,
  className = "",
  editable,
  onNameChange,
  sourceImg,
  focus,
  zoom,
  onFocusChange,
  onZoomChange,
  onDragEnd,
  isCapturing,
}: CardStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(el.clientWidth / CARD_WIDTH, 1));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ height: CARD_HEIGHT * scale }}>
      <div style={{ width: CARD_WIDTH * scale, height: CARD_HEIGHT * scale, margin: "0 auto" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <BuilderCard
            ref={cardRef}
            data={data}
            editable={editable}
            onNameChange={onNameChange}
            sourceImg={sourceImg}
            focus={focus}
            zoom={zoom}
            scale={scale}
            onFocusChange={onFocusChange}
            onZoomChange={onZoomChange}
            onDragEnd={onDragEnd}
            isCapturing={isCapturing}
          />
        </div>
      </div>
    </div>
  );
}
