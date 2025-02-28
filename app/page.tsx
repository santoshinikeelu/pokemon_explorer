import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { PokemonGrid } from "@/components/pokemon-grid";
import { Pagination } from "@/components/pagination";
import { getPokemonList, getPokemonByName } from "@/lib/pokemon";
import { PokemonDetail } from "@/lib/types";

interface HomePageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 12;
  
  let pokemons: PokemonDetail[] = [];
  let totalCount = 0;
  
  if (query) {
    try {
      const pokemon = await getPokemonByName(query.toLowerCase());
      pokemons = pokemon ? [pokemon] : [];
      totalCount = pokemons.length;
    } catch (error) {
      console.error("Error fetching searched Pokémon:", error);
      
      try {
        const allPokemon = await getPokemonList(1000, 0);
        const matchingNames = allPokemon.results
          .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 12);
        
        if (matchingNames.length > 0) {
          const pokemonDetails = await Promise.all(
            matchingNames.map(async (pokemon) => {
              return await getPokemonByName(pokemon.name);
            })
          );
          
          pokemons = pokemonDetails;
          totalCount = pokemons.length;
        } else {
          pokemons = [];
          totalCount = 0;
        }
      } catch (listError) {
        console.error("Error fetching Pokémon list for search:", listError);
        pokemons = [];
        totalCount = 0;
      }
    }
  } else {
    const offset = (currentPage - 1) * pageSize;
    const data = await getPokemonList(pageSize, offset);
    totalCount = data.count;
    
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        return await getPokemonByName(pokemon.name);
      })
    );
    
    pokemons = pokemonDetails;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="container py-8 md:py-12 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Explore the World of Pokémon
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Discover information about your favorite Pokémon species, abilities, and more.
            </p>
            <div className="w-full max-w-lg pt-4">
              <SearchBar />
            </div>
          </div>
          
          <Suspense fallback={<PokemonGrid pokemons={[]} isLoading={true} />}>
            <PokemonGrid pokemons={pokemons} />
          </Suspense>
          
          {!query && (
            <Pagination 
              totalItems={totalCount} 
              pageSize={pageSize} 
              currentPage={currentPage} 
            />
          )}
        </section>
      </main>
    </div>
  );
}