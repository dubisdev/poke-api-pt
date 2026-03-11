"use client";

import { useState, useEffect } from "react";

const DEBOUNCE_MS = 300;

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search…" }: SearchInputProps) {
    const [inputValue, setInputValue] = useState(value);

    // Sync if external value changes (e.g. back/forward navigation)
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(inputValue);
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const isPending = inputValue !== value;

    return (
        <div className="relative flex-1 min-w-48">
            <input
                type="text"
                placeholder={placeholder}
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
    );
}
