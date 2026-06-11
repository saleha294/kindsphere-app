"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import HandleModal from "./HandleModal"; // Keeps your premium functional handle database modal

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userHandle, setUserHandle] = useState<string | null>(null);

  useEffect(() => {
    // 1. Instantly read the saved anonymous handle out of local cache storage
    const savedHandle = localStorage.getItem("kindsphere_handle");
    if (savedHandle) {
      setUserHandle(savedHandle);
    }

    // 2. Global Listener Setup: Catch event requests broadcasted from Feed cards or locked views
    const openModalTrigger = () => setIsModalOpen(true);
    window.addEventListener("open-login-modal", openModalTrigger);

    return () => window.removeEventListener("open-login-modal", openModalTrigger);
  }, []);

  // Fired when HandleModal successfully writes a brand new unique record to Supabase
  function handleAccountCreated(handle: string) {
    setUserHandle(handle);
    setIsModalOpen(false);
    // Smooth reload to seamlessly unlock guest blocks across all running views instantly
    window.location.reload();
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/50">
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

          {/* Desktop Navigation */}
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

            {/* Account Display Slot or Onboarding Action Toggle */}
            {userHandle ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-semibold text-stone-700">
                <User className="h-3.5 w-3.5 text-stone-400" />
                <span>@{userHandle}</span>
              </div>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-[hsl(14,66%,62%)] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Join KindSphere
              </button>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2 -mr-1 rounded-md text-foreground hover:bg-stone-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer layout */}
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
                {userHandle ? (
                  <div className="w-full text-center inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200/60 text-sm font-semibold text-stone-700">
                    <User className="h-4 w-4 text-stone-400" />
                    <span>@{userHandle}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="block w-full text-center rounded-lg bg-[hsl(14,66%,62%)] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Join KindSphere
                  </button>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Renders your operational data submission modal layer */}
      <HandleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountCreated={handleAccountCreated}
      />
    </>
  );
}