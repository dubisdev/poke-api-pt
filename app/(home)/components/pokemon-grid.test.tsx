import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PokemonGrid from "./pokemon-grid";
import type { PokemonListItem } from "@/lib/types";

vi.mock("./pokemon-card", () => ({
  default: ({ pokemon }: { pokemon: PokemonListItem }) => (
    <div data-testid="pokemon-card">{pokemon.name}</div>
  ),
}));

const mockPokemon: PokemonListItem[] = [
  {
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    generation: 1,
    evolutionChainId: 1,
    sprite: "",
  },
  { id: 4, name: "charmander", types: ["fire"], generation: 1, evolutionChainId: 2, sprite: "" },
];

describe("PokemonGrid", () => {
  it("renders a card for each pokemon", () => {
    render(<PokemonGrid pokemon={mockPokemon} searchParams="" />);
    expect(screen.getAllByTestId("pokemon-card")).toHaveLength(2);
  });

  it("shows the correct pokemon count", () => {
    render(<PokemonGrid pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows the empty state when the list is empty", () => {
    render(<PokemonGrid pokemon={[]} searchParams="" />);
    expect(screen.getByText("No Pokémon found.")).toBeInTheDocument();
  });

  it("does not show the card grid when the list is empty", () => {
    render(<PokemonGrid pokemon={[]} searchParams="" />);
    expect(screen.queryAllByTestId("pokemon-card")).toHaveLength(0);
  });
});
