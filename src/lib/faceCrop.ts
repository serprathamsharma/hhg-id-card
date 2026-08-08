// Client-side image loading + face-aware cropping.
// Uses the browser's native FaceDetector API where available (progressive
// enhancement) and falls back to a sensible "upper-center" default crop —
// no ML bundle required, keeping the flow instant on mid-range phones.

export interface Focus {
  /** 0-1 fraction of the image's natural width/height */
  x: number;
  y: number;
}

const DEFAULT_FOCUS: Focus = { x: 0.5, y: 0.36 };

function isHeic(file: File) {
  const name = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

/** Reads a File (converting HEIC/HEIF first if needed) into an HTMLImageElement. */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  let blob: Blob = file;

  if (isHeic(file)) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    blob = Array.isArray(converted) ? converted[0] : converted;
  }

  // A data URL (rather than an object URL) stays valid for as long as the
  // <img> element is reused elsewhere (e.g. the reposition editor), with no
  // manual revoke/lifecycle bookkeeping required.
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(blob);
  });

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not read image"));
    el.src = dataUrl;
  });
}

/** Loads an already-in-memory data URL (e.g. a webcam snap) into an HTMLImageElement. */
export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not read image"));
    el.src = dataUrl;
  });
}

interface NativeFaceDetector {
  detect(img: HTMLImageElement): Promise<Array<{ boundingBox: { x: number; y: number; width: number; height: number } }>>;
}

/** Best-effort face detection. Returns a normalized focal point, or the default. */
export async function detectFocus(img: HTMLImageElement): Promise<Focus> {
  try {
    const w = window as unknown as { FaceDetector?: new (opts?: { fastMode?: boolean; maxDetectedFaces?: number }) => NativeFaceDetector };
    if (!w.FaceDetector) return DEFAULT_FOCUS;

    const detector = new w.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    const faces = await detector.detect(img);
    if (!faces.length) return DEFAULT_FOCUS;

    const { x, y, width, height } = faces[0].boundingBox;
    return {
      x: (x + width / 2) / img.naturalWidth,
      y: (y + height / 2) / img.naturalHeight,
    };
  } catch {
    return DEFAULT_FOCUS;
  }
}

export { DEFAULT_FOCUS };

interface RenderOptions {
  focus: Focus;
  zoom: number; // 1 = tightest cover, >1 zooms in further
  targetWidth: number;
  targetHeight: number;
  grayscale?: boolean;
}

/** Bakes a pan/zoom/focus selection into a fixed-size cropped data URL. */
export function renderCroppedPhoto(img: HTMLImageElement, opts: RenderOptions): string {
  const { focus, zoom, targetWidth, targetHeight, grayscale = true } = opts;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const targetAr = targetWidth / targetHeight;

  let cropW: number;
  let cropH: number;
  if (iw / ih > targetAr) {
    cropH = ih;
    cropW = ih * targetAr;
  } else {
    cropW = iw;
    cropH = iw / targetAr;
  }
  cropW /= zoom;
  cropH /= zoom;

  let cropX = focus.x * iw - cropW / 2;
  let cropY = focus.y * ih - cropH / 2;
  cropX = Math.min(Math.max(cropX, 0), iw - cropW);
  cropY = Math.min(Math.max(cropY, 0), ih - cropH);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  if (grayscale) {
    ctx.filter = "grayscale(1) contrast(1.08) brightness(1.03)";
  }
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetWidth, targetHeight);

  return canvas.toDataURL("image/jpeg", 0.92);
}
