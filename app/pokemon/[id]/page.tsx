import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemonDetail, formatName } from "@/lib/pokemon-api";
import TypeBadge from "@/components/type-badge";

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

    const MAX_STAT = 255;
    const statColors: Record<string, string> = {
        hp: "bg-red-500",
        attack: "bg-orange-500",
        defense: "bg-yellow-500",
        "special-attack": "bg-blue-500",
        "special-defense": "bg-green-500",
        speed: "bg-pink-500",
    };

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
                {/* Main info */}
                <section className="flex flex-col sm:flex-row gap-8 items-center sm:items-start bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="relative h-48 w-48 shrink-0">
                        <Image
                            src={pokemon.officialArt}
                            alt={pokemon.name}
                            fill
                            sizes="192px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {formatName(pokemon.name)}
                        </h2>
                        <p className="text-gray-500">
                            Generation <span className="font-semibold text-gray-800">{pokemon.generation}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pokemon.types.map((type) => (
                                <TypeBadge key={type} type={type} size="md" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Base Stats</h3>
                    <div className="flex flex-col gap-3">
                        {pokemon.stats.map((stat) => (
                            <div key={stat.name} className="flex items-center gap-3">
                                <span className="w-36 text-sm text-gray-500 capitalize shrink-0">
                                    {formatName(stat.name)}
                                </span>
                                <span className="w-10 text-sm font-semibold text-gray-800 text-right shrink-0">
                                    {stat.value}
                                </span>
                                <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${statColors[stat.name] ?? "bg-gray-400"}`}
                                        style={{ width: `${(stat.value / MAX_STAT) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Evolution chain */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Evolution Chain</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {pokemon.evolutionChain.map((stage, index) => {
                            const isCurrent = stage.id === pokemon.id;
                            const href = `/pokemon/${stage.id}${from ? `?from=${encodeURIComponent(from)}` : ""}`;
                            return (
                                <div key={stage.id} className="flex items-center gap-2">
                                    {index > 0 && (
                                        <span className="text-gray-400 text-xl">→</span>
                                    )}
                                    <Link href={href}>
                                        <div
                                            className={`flex flex-col items-center gap-1 rounded-xl p-3 border-2 transition-all ${isCurrent
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-transparent hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                                                }`}
                                        >
                                            <div className="relative h-16 w-16">
                                                <Image
                                                    src={stage.sprite}
                                                    alt={stage.name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 capitalize text-center">
                                                {formatName(stage.name)}
                                            </span>
                                            {isCurrent && (
                                                <span className="text-xs text-red-500 font-semibold">Current</span>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
