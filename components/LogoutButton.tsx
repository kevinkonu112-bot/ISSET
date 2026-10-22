"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, AlertTriangle } from "lucide-react";

export default function LogoutButton() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Erreur déconnexion :", error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton du menu */}
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer text-left"
      >
        <LogOut size={18} />
        <span>Déconnexion</span>
      </button>

      {/* Fenêtre de confirmation (Modal React isolé) */}
      {openModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
            
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold">Confirmation de déconnexion</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Êtes-vous sûr de vouloir vous déconnecter de l'administration ISSET ?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition"
              >
                {loading ? "Déconnexion..." : "Oui, me déconnecter"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}