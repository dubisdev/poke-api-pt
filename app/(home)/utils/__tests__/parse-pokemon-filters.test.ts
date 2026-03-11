import { describe, it, expect } from "vitest";
import { parsePokemonFilters } from "../parse-pokemon-filters";

describe("parsePokemonFilters", () => {
  it("returns empty defaults for an empty string", () => {
    expect(parsePokemonFilters("")).toEqual({ search: "", type: "", generation: 0 });
  });

  it("parses the search term from the q param", () => {
    expect(parsePokemonFilters("q=pikachu")).toEqual({
      search: "pikachu",
      type: "",
      generation: 0,
    });
  });

  it("parses the type param", () => {
    expect(parsePokemonFilters("type=fire")).toEqual({
      search: "",
      type: "fire",
      generation: 0,
    });
  });

  it("parses the generation param", () => {
    expect(parsePokemonFilters("gen=2")).toEqual({
      search: "",
      type: "",
      generation: 2,
    });
  });

  it("parses all params together", () => {
    expect(parsePokemonFilters("q=char&type=fire&gen=1")).toEqual({
      search: "char",
      type: "fire",
      generation: 1,
    });
  });

  it("returns 0 for generation when gen param is missing", () => {
    expect(parsePokemonFilters("q=bulba").generation).toBe(0);
  });
});
