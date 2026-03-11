import type { PokemonListItem } from "@/lib/types";
import PokemonCard from "./pokemon-card";

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  searchParams: string;
}

export default function PokemonGrid({ pokemon, searchParams }: PokemonGridProps) {
  return (
    <>
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">{pokemon.length}</span> Pokémon
      </p>

      {pokemon.length === 0 ? (
        <div className="py-20 text-center text-gray-400">No Pokémon found.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {pokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} searchParams={searchParams} />
          ))}
        </div>
      )}
    </>
  );
}
