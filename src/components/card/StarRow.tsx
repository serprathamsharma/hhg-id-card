import { Star } from "lucide-react";

export default function StarRow({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-[2px]" aria-label={`Rarity: ${count} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-[13px] w-[13px]"
          strokeWidth={1.75}
          color={color}
          fill={i < count ? color : "transparent"}
        />
      ))}
    </div>
  );
}
