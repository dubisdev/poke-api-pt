import { describe, it, expect } from "vitest";
import { filterPokemon } from "./filter-pokemon";
import type { PokemonListItem } from "../../../lib/types";

const pokemon: PokemonListItem[] = [
  {
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    generation: 1,
    evolutionChainId: 1,
    sprite: "",
  },
  {
    id: 2,
    name: "ivysaur",
    types: ["grass", "poison"],
    generation: 1,
    evolutionChainId: 1,
    sprite: "",
  },
  {
    id: 3,
    name: "venusaur",
    types: ["grass", "poison"],
    generation: 1,
    evolutionChainId: 1,
    sprite: "",
  },
  { id: 4, name: "charmander", types: ["fire"], generation: 1, evolutionChainId: 2, sprite: "" },
  { id: 5, name: "charmeleon", types: ["fire"], generation: 1, evolutionChainId: 2, sprite: "" },
  {
    id: 6,
    name: "charizard",
    types: ["fire", "flying"],
    generation: 1,
    evolutionChainId: 2,
    sprite: "",
  },
  { id: 7, name: "squirtle", types: ["water"], generation: 1, evolutionChainId: 3, sprite: "" },
  { id: 152, name: "chikorita", types: ["grass"], generation: 2, evolutionChainId: 4, sprite: "" },
];

describe("filterPokemon", () => {
  describe("no filters", () => {
    it("returns all pokemon when filters are empty", () => {
      expect(filterPokemon(pokemon, {})).toHaveLength(pokemon.length);
    });
  });

  describe("search filter", () => {
    it("matches by name", () => {
      const result = filterPokemon(pokemon, { search: "squirtle" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("squirtle");
    });

    it("is case-insensitive", () => {
      const result = filterPokemon(pokemon, { search: "CHAR" });
      expect(result.map((p) => p.name)).toContain("charmander");
    });

    it("includes the full evolution chain when one member matches", () => {
      // only "venusaur" matches the query, but the whole chain (ids 1,2,3) should be included
      const result = filterPokemon(pokemon, { search: "venusaur" });
      expect(result.map((p) => p.name)).toEqual(
        expect.arrayContaining(["bulbasaur", "ivysaur", "venusaur"]),
      );
    });

    it("does not include chains that have no matching member", () => {
      const result = filterPokemon(pokemon, { search: "char" });
      const names = result.map((p) => p.name);
      expect(names).not.toContain("squirtle");
      expect(names).not.toContain("bulbasaur");
    });

    it("returns empty array when nothing matches", () => {
      expect(filterPokemon(pokemon, { search: "mew" })).toHaveLength(0);
    });
  });

  describe("type filter", () => {
    it("returns only pokemon with the selected type", () => {
      const result = filterPokemon(pokemon, { type: "water" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("squirtle");
    });

    it("works for pokemon with multiple types", () => {
      const result = filterPokemon(pokemon, { type: "flying" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("charizard");
    });

    it("returns all grass pokemon across generations", () => {
      const result = filterPokemon(pokemon, { type: "grass" });
      const names = result.map((p) => p.name);
      expect(names).toContain("bulbasaur");
      expect(names).toContain("chikorita");
    });
  });

  describe("generation filter", () => {
    it("returns only pokemon from the selected generation", () => {
      const result = filterPokemon(pokemon, { generation: 2 });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("chikorita");
    });

    it("returns all gen-1 pokemon", () => {
      const result = filterPokemon(pokemon, { generation: 1 });
      expect(result).toHaveLength(7);
    });

    it("returns empty array for a generation with no pokemon", () => {
      expect(filterPokemon(pokemon, { generation: 9 })).toHaveLength(0);
    });
  });

  describe("combined filters", () => {
    it("applies search and type together", () => {
      // "char" matches charmander/charmeleon/charizard chain; then type=flying narrows to charizard
      const result = filterPokemon(pokemon, { search: "char", type: "flying" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("charizard");
    });

    it("applies type and generation together", () => {
      const result = filterPokemon(pokemon, { type: "grass", generation: 1 });
      const names = result.map((p) => p.name);
      expect(names).toContain("bulbasaur");
      expect(names).not.toContain("chikorita");
    });

    it("returns empty array when combined filters match nothing", () => {
      const result = filterPokemon(pokemon, { type: "water", generation: 2 });
      expect(result).toHaveLength(0);
    });
  });
});
