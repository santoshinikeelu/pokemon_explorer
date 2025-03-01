import { PokemonDetail, PokemonListResponse, PokemonSpecies } from "./types";

const API_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
  
  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }
  
  return res.json();
}

export async function getPokemonByName(name: string): Promise<PokemonDetail> {
  const res = await fetch(`${API_URL}/pokemon/${name.toLowerCase()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon: ${name}`);
  }
  
  return res.json();
}

export async function getPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`${API_URL}/pokemon-species/${id}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon species: ${id}`);
  }
  
  return res.json();
}

export async function searchPokemon(query: string): Promise<string[]> {
  const res = await fetch(`${API_URL}/pokemon?limit=2000`);
  
  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon for search");
  }
  
  const data: PokemonListResponse = await res.json();
  
  const filteredResults = data.results
    .filter(el => el.name.toLowerCase().includes(query.toLowerCase()))
    .map(el => el.name)
    .slice(0, 10); 
    
  return filteredResults;
}

export function getImageFromUrl(url: string): string {
  const id = url.split('/').filter(Boolean).pop();
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokemonName(name: string): string {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  return typeColors[type] || "#777777";
}