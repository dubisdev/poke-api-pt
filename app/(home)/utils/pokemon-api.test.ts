import { describe, it, expect } from "vitest";
import {
  formatName,
  getSprite,
  getOfficialArt,
  generationToNumber,
  flattenEvolutionChain,
} from "../../../lib/pokemon-api";
import type { RawEvolutionLinkOutput } from "../../../lib/schemas";

describe("formatName", () => {
  it("capitalizes a single-word name", () => {
    expect(formatName("bulbasaur")).toBe("Bulbasaur");
  });

  it("capitalizes and joins hyphenated names", () => {
    expect(formatName("great-tusk")).toBe("Great Tusk");
  });

  it("handles multiple hyphens", () => {
    expect(formatName("mr-mime-jr")).toBe("Mr Mime Jr");
  });
});

describe("getSprite", () => {
  it("returns the correct sprite URL", () => {
    expect(getSprite(1)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    );
  });
});

describe("getOfficialArt", () => {
  it("returns the correct official-artwork URL", () => {
    expect(getOfficialArt(1)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    );
  });
});

describe("generationToNumber", () => {
  it.each([
    ["generation-i", 1],
    ["generation-ii", 2],
    ["generation-iii", 3],
    ["generation-iv", 4],
    ["generation-v", 5],
    ["generation-vi", 6],
    ["generation-vii", 7],
    ["generation-viii", 8],
    ["generation-ix", 9],
  ] as const)("maps %s → %d", (name, expected) => {
    expect(generationToNumber(name)).toBe(expected);
  });

  it("returns 0 for unknown generation names", () => {
    expect(generationToNumber("generation-x")).toBe(0);
    expect(generationToNumber("")).toBe(0);
  });
});

describe("flattenEvolutionChain", () => {
  it("returns a single species when there are no evolutions", () => {
    const link: RawEvolutionLinkOutput = {
      species: { name: "eevee", url: "" },
      evolves_to: [],
    };
    expect(flattenEvolutionChain(link)).toEqual(["eevee"]);
  });

  it("flattens a linear three-stage chain", () => {
    const link: RawEvolutionLinkOutput = {
      species: { name: "charmander", url: "" },
      evolves_to: [
        {
          species: { name: "charmeleon", url: "" },
          evolves_to: [
            {
              species: { name: "charizard", url: "" },
              evolves_to: [],
            },
          ],
        },
      ],
    };
    expect(flattenEvolutionChain(link)).toEqual(["charmander", "charmeleon", "charizard"]);
  });

  it("flattens a branching chain", () => {
    const link: RawEvolutionLinkOutput = {
      species: { name: "eevee", url: "" },
      evolves_to: [
        { species: { name: "vaporeon", url: "" }, evolves_to: [] },
        { species: { name: "jolteon", url: "" }, evolves_to: [] },
        { species: { name: "flareon", url: "" }, evolves_to: [] },
      ],
    };
    expect(flattenEvolutionChain(link)).toEqual(["eevee", "vaporeon", "jolteon", "flareon"]);
  });
});
