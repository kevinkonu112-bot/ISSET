"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, AlertTriangle, X } from "lucide-react";

export default function LogoutButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirmSignout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/25 transition cursor-pointer text-left shadow-sm"
      >
        <LogOut size={18} />
        <span>Se déconnecter</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white relative space-y-6">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                <AlertTriangle size={26} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Confirmation de déconnexion</h3>
                <p className="text-xs text-slate-400">Sécurité de session ISSET</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez saisir à nouveau vos identifiants pour accéder au panneau d'administration.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmSignout}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center gap-2"
              >
                {loading ? "Déconnexion..." : "Confirmer"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}