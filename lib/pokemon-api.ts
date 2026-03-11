import * as v from "valibot";
import type { PokemonDetail, PokemonListItem } from "./types";
import { REAL_TYPES } from "./types";
import {
    type RawEvolutionLinkOutput,
    RawPokemonSchema,
    RawGenerationSchema,
    RawTypeSchema,
    RawEvolutionChainSchema,
    RawSpeciesSchema,
    PokemonListResponseSchema,
    EvolutionChainListResponseSchema,
} from "./schemas";

const BASE_URL = "https://pokeapi.co/api/v2";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getJson<TSchema extends v.GenericSchema>(
    url: string,
    schema: TSchema
): Promise<v.InferOutput<TSchema>> {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to fetch: ${url} (${res.status})`);
    const data = await res.json();
    return v.parse(schema, data);
}

async function batchRequests<TSchema extends v.GenericSchema>(
    urls: string[],
    schema: TSchema,
    batchSize = 500
): Promise<v.InferOutput<TSchema>[]> {
    const results: v.InferOutput<TSchema>[] = [];
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((url) => getJson(url, schema)));
        results.push(...batchResults);
    }
    return results;
}

function extractId(url: string): number {
    const parts = url.split("/");
    return parseInt(parts[parts.length - 2]);
}

function generationToNumber(name: string): number {
    const map: Record<string, number> = {
        "generation-i": 1,
        "generation-ii": 2,
        "generation-iii": 3,
        "generation-iv": 4,
        "generation-v": 5,
        "generation-vi": 6,
        "generation-vii": 7,
        "generation-viii": 8,
        "generation-ix": 9,
    };
    return map[name] ?? 0;
}

function flattenEvolutionChain(link: RawEvolutionLinkOutput): string[] {
    return [
        link.species.name,
        ...link.evolves_to.flatMap(flattenEvolutionChain),
    ];
}

export function getSprite(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getOfficialArt(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatName(name: string): string {
    return name
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
}

// ── List page data ─────────────────────────────────────────────────────────────

export async function getAllPokemon(): Promise<PokemonListItem[]> {
    // parallel: pokemon list, all generations, all types, all evolution chains
    const [pokemonList, generationMap, typesMap, evolutionMap] = await Promise.all([
        fetchPokemonList(),
        buildGenerationMap(),
        buildTypesMap(),
        buildEvolutionMap(),
    ]);

    return pokemonList.map(({ id, name }) => ({
        id,
        name,
        sprite: getSprite(id),
        types: typesMap.get(name) ?? [],
        generation: generationMap.get(name) ?? 0,
        evolutionChainId: evolutionMap.get(name) ?? 0,
    }));
}

async function fetchPokemonList(): Promise<{ id: number; name: string }[]> {
    const data = await getJson(
        `${BASE_URL}/pokemon?limit=1025&offset=0`,
        PokemonListResponseSchema
    );
    return data.results.map(({ name, url }) => ({ name, id: extractId(url) }));
}

async function buildGenerationMap(): Promise<Map<string, number>> {
    const generationNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
    const generations = await Promise.all(
        generationNumbers.map((n) =>
            getJson(`${BASE_URL}/generation/${n}`, RawGenerationSchema)
        )
    );

    const map = new Map<string, number>();
    for (const gen of generations) {
        const genNumber = generationToNumber(gen.name);
        for (const species of gen.pokemon_species) {
            map.set(species.name, genNumber);
        }
    }
    return map;
}

async function buildTypesMap(): Promise<Map<string, string[]>> {
    const types = await Promise.all(
        REAL_TYPES.map((type) => getJson(`${BASE_URL}/type/${type}`, RawTypeSchema))
    );

    const map = new Map<string, string[]>();
    for (const typeData of types) {
        for (const { pokemon } of typeData.pokemon) {
            const current = map.get(pokemon.name) ?? [];
            map.set(pokemon.name, [...current, typeData.name]);
        }
    }
    return map;
}

async function buildEvolutionMap(): Promise<Map<string, number>> {
    const list = await getJson(
        `${BASE_URL}/evolution-chain?limit=600`,
        EvolutionChainListResponseSchema
    );

    const chains = await batchRequests(
        list.results.map((r) => r.url),
        RawEvolutionChainSchema
    );

    const map = new Map<string, number>();
    for (const chain of chains) {
        const names = flattenEvolutionChain(chain.chain);
        for (const name of names) {
            map.set(name, chain.id);
        }
    }
    return map;
}

// ── Detail page data ──────────────────────────────────────────────────────────

export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
    const pokemon = await getJson(`${BASE_URL}/pokemon/${id}`, RawPokemonSchema);
    const species = await getJson(pokemon.species.url, RawSpeciesSchema);
    const chainData = await getJson(
        species.evolution_chain.url,
        RawEvolutionChainSchema
    );

    const evolutionNames = flattenEvolutionChain(chainData.chain);

    const evolutionPokemons = await batchRequests(
        evolutionNames.map((name) => `${BASE_URL}/pokemon/${name}`),
        RawPokemonSchema
    );

    const evolutionChain = evolutionPokemons.map((p) => ({
        id: p.id,
        name: p.name,
        sprite: getOfficialArt(p.id),
    }));

    const stats = pokemon.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
    }));

    return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map((t) => t.type.name),
        generation: generationToNumber(species.generation.name),
        stats,
        officialArt: getOfficialArt(pokemon.id),
        evolutionChain,
    };
}
