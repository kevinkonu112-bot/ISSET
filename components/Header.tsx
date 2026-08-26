"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/filieres", label: "Filières" },
  { href: "/actualites", label: "Actualités" },
  { href: "/galerie", label: "Galerie" },
  { href: "/admission", label: "Admission" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-nuit-950/90 backdrop-blur-md shadow-[0_10px_30px_rgba(6,15,36,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-isset flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <img
              src="/logo_isset.png"
              alt="Logo ISSET"
              className="w-10 h-10 object-contain animate-spin-slow logo-image"
            />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            ISSET
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-cyan-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-primary">
            Nous contacter
          </Link>
        </div>

        <button
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 top-20 z-30 bg-nuit-950/98 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container-isset flex flex-col gap-1 py-8">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 40}ms` }}
              className="border-b border-white/10 py-4 text-lg font-medium text-white/90 transition-colors hover:text-cyan-400"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">
            Nous contacter
          </Link>
        </nav>
      </div>
    </header>
  );
}