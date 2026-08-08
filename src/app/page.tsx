"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Background from "@/components/landing/Background";
import Logo from "@/components/landing/Logo";
import Hero from "@/components/landing/Hero";
import UploadCard from "@/components/landing/UploadCard";
import ImageEditor from "@/components/ImageEditor";
import CardStage from "@/components/card/CardStage";
import ResultActions from "@/components/card/ResultActions";
import {
  loadImageFromFile,
  loadImageFromDataUrl,
  detectFocus,
  renderCroppedPhoto,
  DEFAULT_FOCUS,
  type Focus,
} from "@/lib/faceCrop";
import { createBuilderData } from "@/lib/generate";
import { PHOTO_TARGET } from "@/lib/constants";
import type { BuilderData } from "@/lib/types";

type Stage = "landing" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [data, setData] = useState<BuilderData | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [sourceFocus, setSourceFocus] = useState<Focus>(DEFAULT_FOCUS);
  const [isEditingPhoto, setEditingPhoto] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const processImage = useCallback(async (img: HTMLImageElement) => {
    const focus = await detectFocus(img);
    const photo = renderCroppedPhoto(img, {
      focus,
      zoom: 1,
      targetWidth: PHOTO_TARGET.width,
      targetHeight: PHOTO_TARGET.height,
    });

    setSourceImg(img);
    setSourceFocus(focus);
    setData(createBuilderData(photo));
    setStage("result");
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const img = await loadImageFromFile(file);
      await processImage(img);
    },
    [processImage]
  );

  const handleCapture = useCallback(
    async (dataUrl: string) => {
      const img = await loadImageFromDataUrl(dataUrl);
      await processImage(img);
    },
    [processImage]
  );

  function handleReset() {
    setStage("landing");
    setData(null);
    setSourceImg(null);
  }

  function handlePhotoConfirmed(dataUrl: string) {
    setData((prev) => (prev ? { ...prev, photo: dataUrl } : prev));
    setEditingPhoto(false);
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden">
      <Background />

      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative flex min-h-dvh w-full flex-col items-center px-3 py-6 sm:px-6 sm:py-10"
          >
            <nav className="mb-6 flex w-full max-w-[1200px] justify-start sm:mb-8">
              <Logo />
            </nav>

            <div className="flex w-full flex-1 flex-col items-center justify-center gap-7 sm:gap-8">
              <Hero />
              <UploadCard onFile={handleFile} onCapture={handleCapture} />
            </div>
          </motion.main>
        )}

        {stage === "result" && data && (
          <motion.main
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative flex min-h-dvh w-full flex-col items-center justify-center gap-6 px-5 py-8"
          >
            <p className="flex items-center gap-1.5 font-mono text-xs text-white/80">
              <Pencil className="h-3 w-3 text-goa-gold" /> Tap your name on the card to personalize it
            </p>

            <div className="w-full max-w-[380px]">
              <CardStage
                data={data}
                cardRef={cardRef}
                editable={!isCapturing}
                className="w-full"
                onNameChange={(name) => setData((p) => (p ? { ...p, name } : p))}
              />
            </div>

            {sourceImg && (
              <button
                type="button"
                onClick={() => setEditingPhoto(true)}
                className="flex items-center gap-1.5 font-mono text-xs text-white/80 underline underline-offset-4 hover:text-goa-gold"
              >
                <Pencil className="h-3 w-3" /> Reposition photo
              </button>
            )}

            <ResultActions data={data} cardRef={cardRef} onReset={handleReset} onCapturingChange={setIsCapturing} />
          </motion.main>
        )}
      </AnimatePresence>

      {isEditingPhoto && sourceImg && (
        <ImageEditor
          img={sourceImg}
          initialFocus={sourceFocus}
          onConfirm={handlePhotoConfirmed}
          onCancel={() => setEditingPhoto(false)}
        />
      )}
    </div>
  );
}
