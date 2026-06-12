"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import RegisterUser from "./RegisterUser";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Feed" },
  { href: "/drop", label: "Drop a Bottle" },
  { href: "/digest", label: "My Digest" },
  { href: "/globe", label: "The Sphere" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userHandle, setUserHandle] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHandle = localStorage.getItem("kindsphere_handle");
    if (savedHandle) {
      setUserHandle(savedHandle);
    }

    const openModalTrigger = () => setIsModalOpen(true);
    window.addEventListener("open-login-modal", openModalTrigger);

    // Close desktop profile dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("open-login-modal", openModalTrigger);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleAccountCreated(handle: string, id: string) {
    // Both variables are safely linked to anchor local storage metrics
    localStorage.setItem("kindsphere_handle", handle);
    localStorage.setItem("kindsphere_user_id", id);

    setUserHandle(handle);
    setIsModalOpen(false);

    window.dispatchEvent(new Event("local-handle-updated"));
  }

  // ── 11. Core Logout Functional Trigger ──
  function handleLogout() {
    localStorage.removeItem("kindsphere_handle");
    localStorage.removeItem("kindsphere_user_id");
    setUserHandle(null);
    setDropdownOpen(false);
    setOpen(false);

    // Trigger update broadcast layer and push user safely to public dashboard
    window.dispatchEvent(new Event("local-handle-updated"));
    router.push("/");
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
                    onClick={(e) => {
                      if (!userHandle && (href === "/drop" || href === "/digest")) {
                        e.preventDefault();
                        setIsModalOpen(true);
                      }
                    }}
                    className={`text-sm font-medium transition-colors hover:text-primary ${pathname === href ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Account Display Slot with Dropdown Action Menu */}
            {userHandle ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-xs font-semibold text-stone-700 transition-all cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-stone-400" />
                  <span>@{userHandle}</span>
                  <ChevronDown className={`h-3 w-3 text-stone-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Desktop Dropdown Panel */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-stone-200/80 shadow-[0_10px_25px_rgba(0,0,0,0.08)] py-1.5 animate-fade-in">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50/60 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout Workspace
                    </button>
                  </div>
                )}
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
                    onClick={(e) => {
                      if (!userHandle && (href === "/drop" || href === "/digest")) {
                        e.preventDefault();
                        setIsModalOpen(true);
                        setOpen(false);
                      } else {
                        setOpen(false);
                      }
                    }}
                    className={`block text-base font-medium py-3 border-b border-stone-100 last:border-0 transition-colors ${pathname === href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 space-y-2">
                {userHandle ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full text-center inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200/60 text-sm font-semibold text-stone-700">
                      <User className="h-4 w-4 text-stone-400" />
                      <span>@{userHandle}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold py-3 hover:bg-red-100/50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout Workspace
                    </button>
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

      <RegisterUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountCreated={handleAccountCreated}
      />
    </>
  );
}