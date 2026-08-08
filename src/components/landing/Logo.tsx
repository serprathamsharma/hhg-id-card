export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/studio_logo.png"
        alt="2:47PM STUDIO"
        className="h-10 w-auto object-contain transition-transform duration-200 hover:scale-105 sm:h-14"
        style={{ filter: "drop-shadow(2px 3px 6px rgba(0,0,0,0.85))" }}
      />
    </div>
  );
}
