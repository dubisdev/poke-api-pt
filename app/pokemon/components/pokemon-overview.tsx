import Image from "next/image";
import type { PokemonDetail } from "@/lib/types";
import { formatName } from "@/lib/pokemon-api";
import TypeBadge from "../../components/type-badge";

interface PokemonOverviewProps {
  pokemon: PokemonDetail;
}

export default function PokemonOverview({ pokemon }: PokemonOverviewProps) {
  return (
    <section className="flex flex-col sm:flex-row gap-8 items-center sm:items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="relative h-48 w-48 shrink-0">
        <Image
          src={pokemon.officialArt}
          alt={pokemon.name}
          fill
          sizes="192px"
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-gray-900">{formatName(pokemon.name)}</h2>
        <p className="text-gray-500">
          Generation <span className="font-semibold text-gray-800">{pokemon.generation}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="md" />
          ))}
        </div>
      </div>
    </section>
  );
}
