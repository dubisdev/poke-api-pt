"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { PokemonListItem } from "@/lib/types";

export function usePokemonFilters(pokemon: PokemonListItem[]) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get("q") ?? "";
    const selectedType = searchParams.get("type") ?? "";
    const selectedGeneration = Number(searchParams.get("gen") ?? 0);

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

    const filtered = useMemo(() => {
        let result = pokemon;

        if (search) {
            const query = search.toLowerCase();
            const chainIds = new Set(
                result
                    .filter((p) => p.name.includes(query))
                    .map((p) => p.evolutionChainId)
                    .filter(Boolean)
            );
            result = result.filter(
                (p) => p.name.includes(query) || chainIds.has(p.evolutionChainId)
            );
        }

        if (selectedType) {
            result = result.filter((p) => p.types.includes(selectedType));
        }

        if (selectedGeneration) {
            result = result.filter((p) => p.generation === selectedGeneration);
        }

        return result;
    }, [pokemon, search, selectedType, selectedGeneration]);

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
