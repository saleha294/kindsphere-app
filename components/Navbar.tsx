// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Feed" },
  { href: "/drop", label: "Drop a Bottle" },
  { href: "/digest", label: "My Digest" },
  { href: "/globe", label: "The Sphere" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/50">
      {/* ── Constrained inner container ── */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 shrink-0"
          aria-label="KindSphere home"
        >
          <span className="h-8 w-8 rounded-full bg-[hsl(14,66%,62%)]/20 border border-[hsl(14,66%,62%)]/30 flex items-center justify-center">
            <span className="h-4 w-4 rounded-full bg-[hsl(14,66%,62%)]" />
          </span>
          <span className="font-serif text-xl tracking-tight text-foreground">KindSphere</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === href ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/drop"
            className="inline-flex items-center justify-center rounded-lg bg-[hsl(14,66%,62%)] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 active:scale-95 transition-all"
          >
            Join KindSphere
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-1 rounded-md text-foreground hover:bg-stone-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer — also constrained */}
      {open && (
        <nav className="md:hidden border-t border-stone-200/50 bg-white/98 backdrop-blur-md">
          <ul className="w-full max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 list-none m-0">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block text-base font-medium py-3 border-b border-stone-100 last:border-0 transition-colors ${pathname === href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/drop"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-lg bg-[hsl(14,66%,62%)] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Join KindSphere
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}