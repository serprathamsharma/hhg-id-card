/** Deterministic decorative barcode derived from the builder ID — wide, even
 *  gaps so it reads as a clean technical flourish rather than a crowded mess. */
export default function Barcode({ seed, color }: { seed: string; color: string }) {
  const bars = Array.from(seed).map((ch, i) => 1 + ((ch.charCodeAt(0) + i * 7) % 3));
  return (
    <div className="flex h-7 w-full items-stretch gap-[3px]" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, background: color, opacity: i % 5 === 0 ? 0.55 : 1 }} />
      ))}
    </div>
  );
}
