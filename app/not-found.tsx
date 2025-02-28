import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">404 - Not Found</h1>
          <p className="text-muted-foreground max-w-[600px]">
            Oops! The Pokémon you're looking for seems to have escaped into the
            tall grass.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Link href="/">Return to Pokédex</Link>
          </button>
        </div>
      </main>
    </div>
  );
}
