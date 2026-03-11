import Image from "next/image";
import Link from "next/link";
import type { EvolutionStage } from "@/lib/types";
import { formatName } from "@/lib/pokemon-api";

interface EvolutionChainProps {
  evolutionChain: EvolutionStage[];
  currentId: number;
  from?: string;
}

export default function EvolutionChain({ evolutionChain, currentId, from }: EvolutionChainProps) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Evolution Chain</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {evolutionChain.map((stage, index) => {
          const isCurrent = stage.id === currentId;
          const href = `/pokemon/${stage.id}${from ? `?from=${encodeURIComponent(from)}` : ""}`;
          return (
            <div key={stage.id} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400 text-xl">→</span>}
              <Link href={href}>
                <div
                  className={`flex flex-col items-center gap-1 rounded-xl p-3 border-2 transition-all ${
                    isCurrent
                      ? "border-red-500 bg-red-50"
                      : "border-transparent hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <div className="relative h-16 w-16">
                    <Image
                      src={stage.sprite}
                      alt={stage.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 capitalize text-center">
                    {formatName(stage.name)}
                  </span>
                  {isCurrent && <span className="text-xs text-red-500 font-semibold">Current</span>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
