import Link from "next/link";
import Image from "next/image";
import { formatPokemonName, getTypeColor } from "@/lib/pokemon";
import { PokemonDetail } from "@/lib/types";

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const imageUrl = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
  
  return (
    <Link href={`/pokemon/${pokemon.name}`} className="group">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
  <div className="relative flex items-center justify-center bg-gray-100 dark:bg-gray-700 pt-4">
    <div className="absolute top-2 right-2 z-10">
      <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm dark:bg-gray-900/80">
        #{pokemon.id.toString().padStart(3, "0")}
      </span>
    </div>
    <div className="relative h-40 w-40 transition-transform hover:scale-110">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={pokemon.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          priority={pokemon.id <= 20}
        />
      )}
    </div>
  </div>
  <div className="p-4">
    <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
      {formatPokemonName(pokemon.name)}
    </h3>
    <div className="mt-2 flex flex-wrap gap-1">
      {pokemon.types.map(({ type }) => (
        <span
          key={type.name}
          style={{ backgroundColor: getTypeColor(type.name) }}
          className="rounded-full px-2 py-1 text-xs font-medium text-white"
        >
          {type.name}
        </span>
      ))}
    </div>
  </div>
</div>

    </Link>
  );
}