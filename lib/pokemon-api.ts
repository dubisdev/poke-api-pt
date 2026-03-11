import type { PokemonDetail, PokemonListItem } from "./types";
import { REAL_TYPES } from "./consts";
import {
  flattenEvolutionChain,
  generationToNumber,
  getOfficialArtUrl,
  getSpriteUrl,
} from "./format-texts";
import {
  RawPokemonSchema,
  RawGenerationSchema,
  RawTypeSchema,
  RawEvolutionChainSchema,
  RawSpeciesSchema,
  PokemonListResponseSchema,
  EvolutionChainListResponseSchema,
} from "./schemas";
import { batchRequests, getJson } from "./fetch";

const BASE_URL = "https://pokeapi.co/api/v2";

function extractId(url: string): number {
  const parts = url.split("/");
  return parseInt(parts[parts.length - 2]);
}

// ── List page data ─────────────────────────────────────────────────────────────

export async function getAllPokemon(): Promise<PokemonListItem[]> {
  const [pokemonList, generationMap, typesMap, evolutionMap] = await Promise.all([
    fetchPokemonList(),
    buildGenerationMap(),
    buildTypesMap(),
    buildEvolutionMap(),
  ]);

  return pokemonList.map(({ id, name }) => ({
    id,
    name,
    sprite: getSpriteUrl(id),
    types: typesMap.get(name) ?? [],
    generation: generationMap.get(name) ?? 0,
    evolutionChainId: evolutionMap.get(name) ?? 0,
  }));
}

async function fetchPokemonList(): Promise<{ id: number; name: string }[]> {
  const data = await getJson(`${BASE_URL}/pokemon?limit=1025&offset=0`, PokemonListResponseSchema);
  return data.results.map(({ name, url }) => ({ name, id: extractId(url) }));
}

async function buildGenerationMap(): Promise<Map<string, number>> {
  const generationNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
  const generations = await Promise.all(
    generationNumbers.map((n) => getJson(`${BASE_URL}/generation/${n}`, RawGenerationSchema)),
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
    REAL_TYPES.map((type) => getJson(`${BASE_URL}/type/${type}`, RawTypeSchema)),
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
  // Here we get a list of all evolution chains (all are URLs, no names yet)
  const list = await getJson(
    `${BASE_URL}/evolution-chain?limit=600`,
    EvolutionChainListResponseSchema,
  );

  // For each chain we fetch the real data
  const chains = await batchRequests(
    list.results.map((r) => r.url),
    RawEvolutionChainSchema,
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
  const chainData = await getJson(species.evolution_chain.url, RawEvolutionChainSchema);

  const evolutionNames = flattenEvolutionChain(chainData.chain);

  const evolutionPokemons = await batchRequests(
    evolutionNames.map((name) => `${BASE_URL}/pokemon/${name}`),
    RawPokemonSchema,
  );

  const evolutionChain = evolutionPokemons.map((p) => ({
    id: p.id,
    name: p.name,
    sprite: getOfficialArtUrl(p.id),
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
    officialArt: getOfficialArtUrl(pokemon.id),
    evolutionChain,
  };
}
