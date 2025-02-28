"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { searchPokemon } from "@/lib/pokemon";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      const fetchSuggestions = async () => {
        try {
          const results = await searchPokemon(debouncedQuery);
          setSuggestions(results);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      };
      
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      router.push(`/?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  const clearSearch = () => {
    setQuery("");
    router.push("/");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center border rounded-md p-2 w-full">
        <Search className="mr-2 h-5 w-5 text-gray-500" />
        <input
  ref={inputRef}
  type="text"
  placeholder="Search Pokémon..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}
  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
/>

        {query && (
          <button
          onClick={clearSearch}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        )}
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-gray-500 border rounded-md shadow-md">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="p-2 cursor-pointer hover:bg-gray-500"
              onClick={() => {
                setQuery(suggestion);
                handleSearch(suggestion);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
