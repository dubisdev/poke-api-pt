"use client";

import { REAL_TYPES } from "@/lib/types";
import { formatName } from "@/lib/pokemon-api";
import SearchInput from "./search-input";

const GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1);

interface SearchAndFiltersProps {
    search: string;
    selectedType: string;
    selectedGeneration: number;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onGenerationChange: (value: number) => void;
}

export default function SearchAndFilters({
    search,
    selectedType,
    selectedGeneration,
    onSearchChange,
    onTypeChange,
    onGenerationChange,
}: SearchAndFiltersProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <SearchInput value={search} onChange={onSearchChange} placeholder="Search Pokémon..." />

            <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                <option value="">All Types</option>
                {REAL_TYPES.map((type) => (
                    <option key={type} value={type}>
                        {formatName(type)}
                    </option>
                ))}
            </select>

            <select
                value={selectedGeneration}
                onChange={(e) => onGenerationChange(Number(e.target.value))}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                <option value={0}>All Generations</option>
                {GENERATIONS.map((gen) => (
                    <option key={gen} value={gen}>
                        Generation {gen}
                    </option>
                ))}
            </select>
        </div>
    );
}
