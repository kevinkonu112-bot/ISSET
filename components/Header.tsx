"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-nuit-950/95 backdrop-blur-md shadow-lg"
          : "bg-nuit-950/80 backdrop-blur-sm"
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

        {/* Navigation Bureau */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-cyan-400 font-semibold" : "text-white/80 hover:text-cyan-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-primary">
            Nous contacter
          </Link>
        </div>

        {/* Bouton Menu / Burger */}
        <button
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden z-50 relative bg-nuit-950"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay cliquable : ferme le menu si on clique en dehors */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu déroulant mobile professionnel ancré en haut à droite */}
      <div
        className={`absolute top-20 right-4 z-40 w-72 rounded-2xl bg-nuit-950 border border-white/15 p-5 shadow-2xl transition-all duration-200 lg:hidden ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-base font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 font-semibold border-l-4 border-cyan-400"
                    : "text-white/90 hover:bg-cyan-500/10 hover:text-cyan-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 pt-3 border-t border-white/10">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-primary w-full text-center block py-3 text-sm"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </header>
  );
}