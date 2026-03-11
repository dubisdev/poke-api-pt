"use client";

import { useState, useEffect } from "react";
import { REAL_TYPES } from "@/lib/types";
import { formatName } from "@/lib/pokemon-api";

const SEARCH_DEBOUNCE_MS = 300;

interface SearchAndFiltersProps {
    search: string;
    selectedType: string;
    selectedGeneration: number;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onGenerationChange: (value: number) => void;
}

const GENERATIONS = Array.from({ length: 9 }, (_, i) => i + 1);

export default function SearchAndFilters({
    search,
    selectedType,
    selectedGeneration,
    onSearchChange,
    onTypeChange,
    onGenerationChange,
}: SearchAndFiltersProps) {
    const [inputValue, setInputValue] = useState(search);

    // Sync local state if the URL param changes externally (e.g. back/forward)
    useEffect(() => {
        setInputValue(search);
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(inputValue);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const isPending = inputValue !== search;

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="relative flex-1 min-w-48">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {isPending && (
                    <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                )}
            </div>

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
