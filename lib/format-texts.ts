import type { RawEvolutionLinkOutput } from "./schemas";

export function generationToNumber(name: string): number {
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
export function formatName(name: string): string {
  return name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function getOfficialArtUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
export function flattenEvolutionChain(link: RawEvolutionLinkOutput): string[] {
  return [link.species.name, ...link.evolves_to.flatMap(flattenEvolutionChain)];
}
