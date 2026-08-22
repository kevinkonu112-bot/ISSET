"use client";

import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Vérification stricte des routes d'authentification
  const isAuthPage = 
    pathname === "/admin" || 
    pathname === "/admin/forgot-password" || 
    pathname === "/admin/reset-password";

  if (isAuthPage) {
    // Affichage plein écran sans la barre latérale pour l'espace d'authentification
    return <div className="min-h-screen bg-nuit-950 w-full">{children}</div>;
  }

  // Affichage complet avec la barre latérale pour le tableau de bord de gestion
  return (
    <div className="flex min-h-screen bg-nuit-950 text-white">
      <aside className="w-64 bg-nuit-900 border-r border-nuit-800 p-4 hidden md:block">
        <div className="text-xl font-bold mb-8 px-2">ISSET ADMIN</div>
        {/* Navigation du tableau de bord */}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}