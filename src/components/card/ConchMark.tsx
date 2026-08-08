export default function ConchMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 14.5 C4.5 9.5 8.5 5.5 13.5 5.5 C17.5 5.5 20.5 8.5 20.5 12.5 C20.5 15.8 17.8 18.5 14.5 18.5 C11.7 18.5 9.5 16.3 9.5 13.5 C9.5 11.2 11.2 9.5 13.5 9.5 C15.2 9.5 16.5 10.8 16.5 12.5" />
      <path d="M4.5 14.5 C3.9 16.3 4.1 18 5.2 19.2" />
    </svg>
  );
}
