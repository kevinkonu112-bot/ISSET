"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Newspaper, 
  Image as ImageIcon, 
  GraduationCap, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fermer automatiquement le menu mobile lors d'un changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  // Vérification stricte des routes d'authentification
  const isAuthPage = 
    pathname === "/admin" || 
    pathname === "/admin/login" || 
    pathname === "/admin/forgot-password" || 
    pathname === "/admin/reset-password";

  if (isAuthPage) {
    return <div className="min-h-screen bg-nuit-950 w-full">{children}</div>;
  }

  const navLinks = [
    { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/contenus", label: "Contenus (cours, vidéos, PDF)", icon: FileText },
    { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
    { href: "/admin/galerie", label: "Galerie", icon: ImageIcon },
    { href: "/admin/series", label: "Filières & séries", icon: GraduationCap },
    { href: "/admin/parametres", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-nuit-950 text-white relative">
      {/* 1. BARRE MOBILE SUPÉRIEURE (Visible uniquement sur mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-nuit-900 border-b border-nuit-800 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 text-white font-bold p-1.5 rounded-lg text-xs">I</div>
          <span className="text-base font-bold tracking-wider">ISSET ADMIN</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 text-cyan-400 hover:bg-white/10 transition"
          aria-label="Ouvrir le menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 2. TIROIR DE NAVIGATION MOBILE (Overlay coulissant) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-nuit-950/80 backdrop-blur-sm pt-20 px-4 pb-6 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-2 mt-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-nuit-800 mt-6">
            <form action="/auth/signout" method="post">
              <button 
                type="submit" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition w-full cursor-pointer"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SIDEBAR FIXE CLASSIQUE (Bureau / PC) */}
      <aside className="w-64 bg-nuit-900 border-r border-nuit-800 p-6 hidden md:flex flex-col justify-between shrink-0 min-h-screen sticky top-0">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-cyan-500 text-white font-bold p-2 rounded-lg text-sm">I</div>
            <span className="text-xl font-bold tracking-wider">ISSET ADMIN</span>
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${isActive ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <form action="/auth/signout" method="post">
            <button 
              type="submit" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition w-full cursor-pointer"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* 4. CONTENU PRINCIPAL (Marge supérieure ajoutée sur mobile pour éviter la barre fixe) */}
      <main className="flex-1 p-4 sm:p-8 pt-20 md:pt-8 overflow-y-auto bg-nuit-950 text-white w-full">
        {children}
      </main>
    </div>
  );
}