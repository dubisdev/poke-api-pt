import type { PokemonListItem } from "./types";

export interface PokemonFilters {
    search?: string;
    type?: string;
    generation?: number;
}

export function filterPokemon(
    pokemon: PokemonListItem[],
    filters: PokemonFilters
): PokemonListItem[] {
    const { search, type, generation } = filters;
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

    if (type) {
        result = result.filter((p) => p.types.includes(type));
    }

    if (generation) {
        result = result.filter((p) => p.generation === generation);
    }

    return result;
}
