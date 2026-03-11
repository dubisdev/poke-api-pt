export interface PokemonFiltersFromUrl {
  search: string;
  type: string;
  generation: number;
}

export function parsePokemonFilters(searchParamsString: string): PokemonFiltersFromUrl {
  const p = new URLSearchParams(searchParamsString);
  return {
    search: p.get("q") ?? "",
    type: p.get("type") ?? "",
    generation: Number(p.get("gen") ?? 0),
  };
}
