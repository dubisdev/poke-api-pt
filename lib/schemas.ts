import * as v from "valibot";

// ── Raw PokeAPI response schemas ──────────────────────────────────────────────

export const RawNamedResourceSchema = v.object({
  name: v.string(),
  url: v.string(),
});

export const RawPokemonSchema = v.object({
  id: v.number(),
  name: v.string(),
  types: v.array(
    v.object({
      slot: v.number(),
      type: v.object({ name: v.string() }),
    }),
  ),
  sprites: v.object({
    front_default: v.nullable(v.string()),
    other: v.object({
      "official-artwork": v.object({
        front_default: v.nullable(v.string()),
      }),
    }),
  }),
  species: v.object({ url: v.string() }),
  stats: v.array(
    v.object({
      base_stat: v.number(),
      stat: v.object({ name: v.string() }),
    }),
  ),
});

export const RawGenerationSchema = v.object({
  id: v.number(),
  name: v.string(),
  pokemon_species: v.array(v.object({ name: v.string() })),
});

export const RawTypeSchema = v.object({
  name: v.string(),
  pokemon: v.array(
    v.object({
      pokemon: v.object({ name: v.string() }),
    }),
  ),
});

// Recursive structure – must use v.lazy() and a manual interface
export interface RawEvolutionLinkOutput {
  species: { name: string; url: string };
  evolves_to: RawEvolutionLinkOutput[];
}

export const RawEvolutionLinkSchema: v.GenericSchema<RawEvolutionLinkOutput> = v.object({
  species: v.object({ name: v.string(), url: v.string() }),
  evolves_to: v.array(v.lazy(() => RawEvolutionLinkSchema)),
});

export const RawEvolutionChainSchema = v.object({
  id: v.number(),
  chain: RawEvolutionLinkSchema,
});

export const RawSpeciesSchema = v.object({
  generation: v.object({ name: v.string() }),
  evolution_chain: v.object({ url: v.string() }),
});

// Paginated list responses
export const PokemonListResponseSchema = v.object({
  results: v.array(RawNamedResourceSchema),
});

export const EvolutionChainListResponseSchema = v.object({
  results: v.array(v.object({ url: v.string() })),
});

// ── Output schemas ────────────────────────────────────────────────────────────

export const PokemonStatSchema = v.object({
  name: v.string(),
  value: v.number(),
});

export const EvolutionStageSchema = v.object({
  id: v.number(),
  name: v.string(),
  sprite: v.string(),
});

export const PokemonListItemSchema = v.object({
  id: v.number(),
  name: v.string(),
  types: v.array(v.string()),
  generation: v.number(),
  evolutionChainId: v.number(),
  sprite: v.string(),
});

export const PokemonDetailSchema = v.object({
  id: v.number(),
  name: v.string(),
  types: v.array(v.string()),
  generation: v.number(),
  stats: v.array(PokemonStatSchema),
  officialArt: v.string(),
  evolutionChain: v.array(EvolutionStageSchema),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type PokemonListItem = v.InferOutput<typeof PokemonListItemSchema>;
export type PokemonStat = v.InferOutput<typeof PokemonStatSchema>;
export type EvolutionStage = v.InferOutput<typeof EvolutionStageSchema>;
export type PokemonDetail = v.InferOutput<typeof PokemonDetailSchema>;
