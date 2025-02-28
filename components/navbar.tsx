"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon, Zap } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-16 items-center mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span className="font-bold text-xl">PokéNext</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Link href="/" className={`px-4 py-2 text-sm font-medium ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              Home
            </Link>
          </nav>
          <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="relative mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-2 transition-all hover:bg-gray-200 dark:hover:bg-gray-800"
>
  <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  <span className="sr-only">Toggle theme</span>
</button>

        </div>
      </div>
    </header>
  );
}