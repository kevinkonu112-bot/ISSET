"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  FileStack,
  Newspaper,
  Image as ImageIcon,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-brume-200">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-nuit-900/5 bg-nuit-950 text-white lg:flex">
        <div className="flex h-20 items-center gap-2.5 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-nuit-700 font-display text-sm font-bold">
            I
          </span>
          <div>
            <p className="font-display text-sm font-bold leading-none">ISSET ADMIN</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active ? "bg-cyan-500/15 text-cyan-400" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mx-4 mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-red-400"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-nuit-900/5 bg-white px-6 lg:hidden">
          <span className="font-display text-sm font-bold text-nuit-950">ISSET ADMIN</span>
          <button onClick={handleLogout} className="text-xs font-semibold text-red-500">
            Déconnexion
          </button>
        </header>
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
