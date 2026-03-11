import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemonDetail } from "@/lib/pokemon-api";
import { formatName } from "@/lib/format-texts";
import PokemonOverview from "@/app/pokemon/components/pokemon-overview";
import StatsSection from "@/app/pokemon/components/stats-section";
import EvolutionChain from "@/app/pokemon/components/evolution-chain";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Pokédex - #${id}` };
}

export default async function PokemonPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { from } = await searchParams;

  const pokemonId = parseInt(id);
  if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 1025) notFound();

  const pokemon = await getPokemonDetail(pokemonId);
  const backHref = from ? `/?${from}` : "/";

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white py-4 px-4 shadow-md">
        <div className="mx-auto max-w-3xl flex items-center gap-4">
          <Link
            href={backHref}
            className="text-red-100 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to list
          </Link>
          <h1 className="text-xl font-bold">
            {formatName(pokemon.name)}{" "}
            <span className="text-red-200 font-mono text-base">
              #{String(pokemon.id).padStart(4, "0")}
            </span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-8">
        <PokemonOverview pokemon={pokemon} />
        <StatsSection stats={pokemon.stats} />
        <EvolutionChain
          evolutionChain={pokemon.evolutionChain}
          currentId={pokemon.id}
          from={from}
        />
      </div>
    </main>
  );
}
