import { TYPE_COLORS } from "@/lib/types";
import { formatName } from "@/lib/pokemon-api";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export default function TypeBadge({ type, size = "sm" }: TypeBadgeProps) {
  const colorClass = TYPE_COLORS[type] ?? "bg-gray-400 text-white";
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span className={`${colorClass} ${sizeClass} rounded-full font-semibold capitalize`}>
      {formatName(type)}
    </span>
  );
}
