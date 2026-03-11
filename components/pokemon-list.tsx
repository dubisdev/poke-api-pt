"use client";

import type { PokemonListItem } from "@/lib/types";
import { usePokemonFilters } from "@/hooks/use-pokemon-filters";
import SearchAndFilters from "./search-and-filters";
import PokemonGrid from "./pokemon-grid";

interface PokemonListProps {
    pokemon: PokemonListItem[];
}

export default function PokemonList({ pokemon }: PokemonListProps) {
    const {
        search,
        selectedType,
        selectedGeneration,
        filtered,
        rawSearchParams,
        updateSearch,
        updateType,
        updateGeneration,
    } = usePokemonFilters(pokemon);

    return (
        <div className="flex flex-col gap-6">
            <SearchAndFilters
                search={search}
                selectedType={selectedType}
                selectedGeneration={selectedGeneration}
                onSearchChange={updateSearch}
                onTypeChange={updateType}
                onGenerationChange={updateGeneration}
            />
            <PokemonGrid pokemon={filtered} searchParams={rawSearchParams} />
        </div>
    );
}
