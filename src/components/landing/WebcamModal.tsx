"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export default function WebcamModal({ isOpen, onClose, onCapture }: WebcamModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setError(null);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        if (!cancelled) setError("Could not access camera. Please allow camera permissions or upload an image file.");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [isOpen]);

  function handleSnap() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/png"));
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[500px] flex-col items-center gap-5 rounded-[20px] border-2 p-7 text-center"
        style={{ background: "var(--goa-green-deep)", borderColor: "var(--goa-gold)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between">
          <h3 className="font-mono font-bold text-goa-gold">TAKE HACKER PHOTO</h3>
          <button type="button" onClick={onClose} className="text-goa-muted hover:text-goa-gold" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {error ? (
          <p className="font-mono text-sm text-red-400">{error}</p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="max-h-[320px] w-full rounded-xl border-2 bg-black object-cover"
            style={{ borderColor: "var(--goa-gold)" }}
          />
        )}

        <div className="flex gap-4">
          <Button type="button" onClick={handleSnap} disabled={!!error}>
            <Camera className="h-4 w-4" /> Snap Photo
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
