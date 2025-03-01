import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import {
  formatPokemonName,
  getPokemonByName,
  getPokemonSpecies,
  getTypeColor,
} from "@/lib/pokemon";

interface PokemonPageProps {
  params: {
    name: string;
  };
}
interface PokemonResult {
  name: string;
}

interface PokemonList {
  results: PokemonResult[];
}

export async function generateStaticParams(): Promise<{ name: string }[]> {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
  const pokemonList: PokemonList = await response.json();

  const params: { name: string }[] = [];

  for (const el of pokemonList.results) {
    try {
      await fetch(`https://pokeapi.co/api/v2/pokemon/${el.name}`);
      params.push({ name: el.name });
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`Skipping ${el.name}: ${error.message}`);
      } else {
        console.warn(`Skipping ${el.name}: An unknown error occurred`);
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PokemonPageProps) {
  const name = formatPokemonName(params.name);

  return {
    title: `${name} | PokéNext`,
    description: `Learn all about ${name}, its stats, abilities, and more.`,
  };
}

export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function PokemonPage({ params }: PokemonPageProps) {
  let pokemon;
  let species;

  try {
    pokemon = await getPokemonByName(params.name);
    species = await getPokemonSpecies(pokemon.id);
  } catch (error) {
    notFound();
  }

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default;

  const description = species.flavor_text_entries
    .find((entry) => entry.language.name === "en")
    ?.flavor_text.replace(/\f/g, " ")
    .replace(/\u00ad\n/g, "")
    .replace(/\u00ad/g, "")
    .replace(/\n/g, " ");

  const genus =
    species.genera.find((g) => g.language.name === "en")?.genus || "";
  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);
  const maxStat = Math.max(...pokemon.stats.map((s) => s.base_stat));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:underline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Pokédex
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="flex flex-col items-center">
            <div
              className="relative w-full aspect-square max-w-md rounded-lg overflow-hidden mb-4"
              style={{
                backgroundColor: `${getTypeColor(
                  pokemon.types[0].type.name
                )}20`,
              }}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={pokemon.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-8"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: getTypeColor(type.name) }}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {formatPokemonName(pokemon.name)}
            </h1>
            <p className="text-gray-500">{genus}</p>

            {description && (
              <div className="border rounded-lg p-4 my-4 bg-white/80 dark:bg-gray-500">
                <p>{description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 my-4">
              <div>
                <span className="text-sm text-gray-500">Height</span>
                <p className="font-medium">{height} m</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Weight</span>
                <p className="font-medium">{weight} kg</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3">Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div
                  key={stat.stat.name}
                  className="flex items-center space-x-2"
                >
                  <span className="text-sm font-medium w-24">
                    {stat.stat.name.toUpperCase()}
                  </span>
                  <span className="text-sm">{stat.base_stat}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stat.base_stat < 50
                          ? "bg-red-500"
                          : stat.base_stat < 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${(stat.base_stat / maxStat) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Abilities</h2>
            <div className="space-y-4">
              {pokemon.abilities.map(({ ability }) => (
                <div
                  key={ability.name}
                  className="p-4 border rounded-lg bg-white/80 dark:bg-gray-500"
                >
                  <h3 className="font-semibold">
                    {formatPokemonName(ability.name)}
                  </h3>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Moves</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pokemon.moves.slice(0, 10).map((move) => (
                <div
                  key={move.move.name}
                  className="p-2 border rounded-md text-sm"
                >
                  {formatPokemonName(move.move.name)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}