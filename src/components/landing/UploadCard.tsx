"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Camera, Upload, Lock } from "lucide-react";
import WebcamModal from "./WebcamModal";

const MAX_SIZE = 10 * 1024 * 1024;

interface UploadCardProps {
  onFile: (file: File) => void;
  onCapture: (dataUrl: string) => void;
}

export default function UploadCard({ onFile, onCapture }: UploadCardProps) {
  const [error, setError] = useState<string | null>(null);
  const [isWebcamOpen, setWebcamOpen] = useState(false);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length) {
        const reason = rejections[0]?.errors[0]?.code;
        setError(reason === "file-too-large" ? "File must be under 10MB." : "Unsupported file type.");
        return;
      }
      const file = accepted[0];
      if (!file) return;
      setError(null);
      onFile(file);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_SIZE,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
  });

  return (
    <div className="relative w-full max-w-[580px]">
      <div
        {...getRootProps()}
        className="flex flex-col items-center overflow-hidden rounded-[24px] border-[1.5px] border-dashed px-6 py-9 text-center backdrop-blur-2xl transition-all duration-300 sm:px-8 sm:py-11"
        style={{
          background: isDragActive ? "rgba(18,51,38,0.88)" : "var(--goa-card-bg)",
          borderColor: isDragActive ? "var(--goa-gold-bright)" : "var(--goa-card-border)",
          boxShadow: isDragActive
            ? "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(245,208,32,0.25)"
            : "0 25px 50px -12px rgba(0,0,0,0.65), inset 0 0 35px rgba(245,208,32,0.03)",
          transform: isDragActive ? "scale(1.015)" : undefined,
        }}
      >
        <input {...getInputProps()} aria-label="Upload your photo" />

        <Camera
          className="mb-5 h-11 w-11 text-goa-gold"
          strokeWidth={1.5}
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
          aria-hidden="true"
        />

        <h2 className="font-mono text-[1.15rem] font-bold uppercase tracking-wide text-goa-cream sm:text-[1.3rem]">
          Upload your photo
        </h2>
        <p className="mt-1 mb-7 font-mono text-[0.95rem] text-goa-muted">or drag and drop here</p>

        <div className="mb-6 flex w-full max-w-[400px] flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center justify-center gap-3 rounded-[10px] px-6 py-[0.85rem] font-mono text-[1.05rem] font-bold tracking-wide text-[#081a13] transition-all hover:-translate-y-0.5"
            style={{ background: "var(--goa-gold)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
          >
            <span>Choose Image</span>
            <span className="h-[18px] w-px" style={{ background: "rgba(8,26,19,0.4)" }} />
            <Upload className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={() => setWebcamOpen(true)}
            className="inline-flex items-center gap-2 rounded-[10px] border px-5 py-[0.85rem] font-mono text-[0.95rem] font-bold text-goa-gold transition-all"
            style={{ background: "rgba(245,208,32,0.12)", borderColor: "rgba(245,208,32,0.35)" }}
            title="Take a live photo using camera"
          >
            <Camera className="h-[18px] w-[18px]" />
            <span>Webcam</span>
          </button>
        </div>

        <p className="font-mono text-[0.82rem] uppercase tracking-wide text-goa-muted">
          PNG &bull; JPG &bull; HEIC (MAX 10MB)
        </p>

        {error && <p className="mt-2 font-mono text-xs text-red-300">{error}</p>}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2.5 text-center font-mono text-[0.85rem] text-goa-cream">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-goa-gold"
          style={{ borderColor: "var(--goa-gold)" }}
        >
          <Lock className="h-3.5 w-3.5" />
        </span>
        <span>Your data is private and never stored.</span>
      </div>

      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setWebcamOpen(false)}
        onCapture={(dataUrl) => {
          setWebcamOpen(false);
          onCapture(dataUrl);
        }}
      />
    </div>
  );
}
