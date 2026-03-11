import { getAllPokemon } from "@/lib/pokemon-api";
import PokemonList from "@/app/(home)/components/pokemon-list";

export default async function Home() {
  const pokemon = await getAllPokemon();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white py-6 px-4 shadow-md">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight">Pokédex</h1>
          <p className="mt-1 text-red-100 text-sm">{pokemon.length} Pokémon from all generations</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <PokemonList pokemon={pokemon} />
      </div>
    </main>
  );
}
