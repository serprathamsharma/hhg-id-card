export default function Hero() {
  return (
    <div className="flex w-full max-w-[1200px] flex-col items-center text-center">
      <div
        className="relative mx-auto w-full max-w-[900px]"
        style={{ aspectRatio: "1024 / 211" }}
      >
        {/* aspect-ratio gives this wrapper a definite (non-auto) height so the
            गोवा badge's percentage height below resolves consistently at
            every viewport width instead of just at the sizes we happened to test. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hacker_house_text.png"
          alt="HACKER HOUSE"
          className="absolute inset-0 h-full w-full object-contain"
          style={{ filter: "drop-shadow(3px 6px 12px rgba(0,0,0,0.9))" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/goa_hindi.png"
          alt="गोवा"
          className="absolute left-[49.2%] top-[48%] h-[65%] w-auto object-contain"
          style={{
            transform: "translate(-50%, -50%) rotate(-3deg)",
            filter: "drop-shadow(0 0 16px rgba(255,26,140,0.8)) drop-shadow(3px 4px 8px rgba(0,0,0,0.9))",
            animation: "float-goa 3.6s ease-in-out infinite",
          }}
        />
      </div>

      <div className="mt-3 flex w-full max-w-[900px] flex-col items-center justify-between gap-1.5 px-2 font-mono text-[0.85rem] font-bold tracking-wide text-goa-gold [text-shadow:0_2px_5px_rgba(0,0,0,0.9)] sm:flex-row sm:gap-0 sm:text-[1.05rem]">
        <span>GOA, INDIA &nbsp;&middot;&nbsp; 28 – 31 OCT 2026</span>
        <span>2:47 PM STUDIO</span>
      </div>
    </div>
  );
}
