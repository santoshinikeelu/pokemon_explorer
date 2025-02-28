"use client";

import { useState, useEffect } from "react";
import { PokemonCard } from "@/components/pokemon-card";
import { PokemonDetail } from "@/lib/types";

interface PokemonGridProps {
  pokemons: PokemonDetail[];
  isLoading?: boolean;
}

export function PokemonGrid({ pokemons, isLoading = false }: PokemonGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <div className="h-48 bg-muted"></div>
            <div className="p-4 space-y-3 animate-pulse">
              <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No Pokémon found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
    {pokemons.map((pokemon) => (
      <PokemonCard key={pokemon.id} pokemon={pokemon} />
    ))}
  </div>
</div>

  );
}
