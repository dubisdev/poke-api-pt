import Image from "next/image";
import Link from "next/link";
import type { PokemonListItem } from "@/lib/types";
import { formatName } from "@/lib/pokemon-api";
import TypeBadge from "./type-badge";

interface PokemonCardProps {
    pokemon: PokemonListItem;
    searchParams: string;
}

export default function PokemonCard({ pokemon, searchParams }: PokemonCardProps) {
    const detailUrl = `/pokemon/${pokemon.id}${searchParams ? `?from=${encodeURIComponent(searchParams)}` : ""}`;

    return (
        <Link href={detailUrl}>
            <article className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300 cursor-pointer">
                <span className="text-xs text-gray-400 font-mono self-end">
                    #{String(pokemon.id).padStart(4, "0")}
                </span>
                <div className="relative h-24 w-24">
                    <Image
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        fill
                        sizes="96px"
                        className="object-contain group-hover:scale-110 transition-transform"
                    />
                </div>
                <h2 className="text-sm font-semibold text-gray-800 text-center">
                    {formatName(pokemon.name)}
                </h2>
                <p className="text-xs text-gray-500">Gen {pokemon.generation}</p>
                <div className="flex flex-wrap justify-center gap-1">
                    {pokemon.types.map((type) => (
                        <TypeBadge key={type} type={type} />
                    ))}
                </div>
            </article>
        </Link>
    );
}
