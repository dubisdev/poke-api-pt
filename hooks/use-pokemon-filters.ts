"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { PokemonListItem } from "@/lib/types";
import { filterPokemon } from "@/app/(home)/utils/filter-pokemon";
import { parsePokemonFilters } from "@/app/(home)/utils/parse-pokemon-filters";

export function usePokemonFilters(pokemon: PokemonListItem[]) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { search, type: selectedType, generation: selectedGeneration } =
        parsePokemonFilters(searchParams.toString());

    function updateParams(updates: Record<string, string | number>) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (!value || value === 0) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    const filtered = useMemo(
        () => filterPokemon(pokemon, { search, type: selectedType, generation: selectedGeneration }),
        [pokemon, search, selectedType, selectedGeneration]
    );

    return {
        search,
        selectedType,
        selectedGeneration,
        filtered,
        rawSearchParams: searchParams.toString(),
        updateSearch: (value: string) => updateParams({ q: value }),
        updateType: (value: string) => updateParams({ type: value }),
        updateGeneration: (value: number) => updateParams({ gen: value }),
    };
}
