import type { PokemonStat } from "@/lib/types";
import { formatName } from "@/lib/format-texts";

const MAX_STAT = 255;

const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-500",
  attack: "bg-orange-500",
  defense: "bg-yellow-500",
  "special-attack": "bg-blue-500",
  "special-defense": "bg-green-500",
  speed: "bg-pink-500",
};

interface StatsSectionProps {
  stats: PokemonStat[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Base Stats</h3>
      <div className="flex flex-col gap-3">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center gap-3">
            <span className="w-36 text-sm text-gray-500 capitalize shrink-0">
              {formatName(stat.name)}
            </span>
            <span className="w-10 text-sm font-semibold text-gray-800 text-right shrink-0">
              {stat.value}
            </span>
            <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${STAT_COLORS[stat.name] ?? "bg-gray-400"}`}
                style={{ width: `${(stat.value / MAX_STAT) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
