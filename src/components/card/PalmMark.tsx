export default function PalmMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round">
      <path d="M12 21 V11" />
      <path d="M12 12 C 7 10 6 5 4 4 C 6 8 7 11 12 12" />
      <path d="M12 12 C 17 10 18 5 20 4 C 18 8 17 11 12 12" />
      <path d="M12 11 C 9 8 10 4 8 2 C 10 5 11 8 12 11" />
      <path d="M12 11 C 15 8 14 4 16 2 C 14 5 13 8 12 11" />
    </svg>
  );
}
