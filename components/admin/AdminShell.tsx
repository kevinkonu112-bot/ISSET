"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FileStack,
  Newspaper,
  Image as ImageIcon,
  GraduationCap,
  Settings,
  Menu,
  X,
  Globe,
  ExternalLink,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

const NAV = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/contenus", label: "Contenus (cours, vidéos, PDF)", icon: FileStack },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/admin/series", label: "Filières & séries", icon: GraduationCap },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white lg:flex justify-between">
        <div>
          {/* Logo & Titre */}
          <div className="flex h-20 items-center gap-2.5 px-6 border-b border-slate-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-700 font-display text-sm font-bold text-white shadow-md">
              I
            </span>
            <div>
              <p className="font-display text-sm font-bold leading-none text-white">ISSET ADMIN</p>
              <p className="text-[10px] text-slate-400 mt-1">Digital Elite Lab</p>
            </div>
          </div>

          {/* Navigation Principale */}
          <nav className="space-y-1 px-4 mt-6">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active 
                      ? "bg-cyan-500/15 text-cyan-400 font-semibold border border-cyan-500/30" 
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Zone Inférieure : Aperçu site & Déconnexion via LogoutButton */}
        <div className="p-4 space-y-2 border-t border-slate-800">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 transition"
          >
            <span className="flex items-center gap-2">
              <Globe size={16} /> Voir le site en direct
            </span>
            <ExternalLink size={14} className="opacity-80" />
          </Link>

          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col bg-slate-950">
        {/* Header Desktop Supérieur */}
        <header className="hidden lg:flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-10 shadow-xs backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400">
            Plateforme de gestion globale ISSET
          </span>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Globe size={15} className="text-cyan-400" />
            <span>Voir le site en direct</span>
            <ExternalLink size={13} className="opacity-70" />
          </Link>
        </header>

        {/* Header Mobile */}
        <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden shadow-sm z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-slate-700"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="font-display text-sm font-bold text-white">ISSET ADMIN</span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs"
          >
            <Globe size={14} /> Site
          </Link>
        </header>

        {/* Menu déroulant mobile */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-800 bg-slate-900 px-4 py-4 lg:hidden shadow-lg z-10 space-y-3">
            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      active ? "bg-cyan-500/15 text-cyan-400 font-semibold" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <LogoutButton />
          </div>
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}