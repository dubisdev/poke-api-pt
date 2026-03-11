"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { PokemonListItem } from "@/lib/types";
import PokemonCard from "./pokemon-card";
import SearchAndFilters from "./search-and-filters";

interface PokemonListProps {
    pokemon: PokemonListItem[];
}

export default function PokemonList({ pokemon }: PokemonListProps) {
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
            const directMatches = result.filter((p) => p.name.includes(query));
            const chainIds = new Set(
                directMatches.map((p) => p.evolutionChainId).filter(Boolean)
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

    const rawSearchParams = searchParams.toString();

    return (
        <div className="flex flex-col gap-6">
            <SearchAndFilters
                search={search}
                selectedType={selectedType}
                selectedGeneration={selectedGeneration}
                onSearchChange={(value) => updateParams({ q: value })}
                onTypeChange={(value) => updateParams({ type: value })}
                onGenerationChange={(value) => updateParams({ gen: value })}
            />

            <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filtered.length}</span> Pokémon
            </p>

            {filtered.length === 0 ? (
                <div className="py-20 text-center text-gray-400">No Pokémon found.</div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filtered.map((p) => (
                        <PokemonCard key={p.id} pokemon={p} searchParams={rawSearchParams} />
                    ))}
                </div>
            )}
        </div>
    );
}
