import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import PokemonCard from "../pokemon-card";
import type { PokemonListItem } from "@/lib/types";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPokemon: PokemonListItem = {
  id: 25,
  name: "pikachu",
  types: ["electric"],
  generation: 1,
  evolutionChainId: 10,
  sprite: "https://example.com/pikachu.png",
};

describe("PokemonCard", () => {
  it("renders the formatted pokemon name", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
  });

  it("renders the zero-padded id", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByText("#0025")).toBeInTheDocument();
  });

  it("renders type badges", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByText("Electric")).toBeInTheDocument();
  });

  it("renders generation info", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByText("Gen 1")).toBeInTheDocument();
  });

  it("links to the detail page with no from param when searchParams is empty", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pokemon/25");
  });

  it("includes a from param in the link when searchParams is provided", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="type=fire" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/pokemon/25?from=${encodeURIComponent("type=fire")}`,
    );
  });

  it("renders the pokemon sprite image", () => {
    render(<PokemonCard pokemon={mockPokemon} searchParams="" />);
    expect(screen.getByAltText("pikachu")).toBeInTheDocument();
  });
});
