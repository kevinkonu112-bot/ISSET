"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldCheck, Lock, KeyRound, CheckCircle2, AlertCircle, UserCheck } from "lucide-react";

export default function AdminSecuritePage() {
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, [supabase]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", text: "Le nouveau mot de passe et la confirmation ne correspondent pas." });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: "error", text: "Le nouveau mot de passe doit comporter au moins 6 caractères." });
      return;
    }

    setLoading(true);

    try {
      // 1. Vérification sécurisée du mot de passe actuel en re-tentant une authentification
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (authError) {
        throw new Error("Le mot de passe actuel saisi est incorrect.");
      }

      // 2. Application du nouveau mot de passe dans Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setStatus({ type: "success", text: "Mot de passe mis à jour avec succès dans la base de données !" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de mise à jour.";
      setStatus({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="text-cyan-400" size={28} />
          Sécurité & Paramètres du Compte
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Gestion des accès de haute sécurité (Directeur & Administration ISSET).
        </p>
      </div>

      {/* CARTE INFOS IDENTIFIANT CONNECTÉ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4 shadow-lg">
        <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
          <UserCheck size={24} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Compte Administrateur Connecté</p>
          <p className="text-base font-bold text-white mt-0.5">{userEmail || "Chargement..."}</p>
        </div>
      </div>

      {/* FORMULAIRE DE MOT DE PASSE STYLE META / STRIPE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Changer le mot de passe</h2>
            <p className="text-xs text-slate-400">Exige l'ancien mot de passe pour des raisons de sécurité</p>
          </div>
        </div>

        {status && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs flex items-center gap-3 border ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:border-cyan-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:border-cyan-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:border-cyan-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}