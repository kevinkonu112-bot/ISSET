"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 1. Vérification que les deux nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }

    // 2. Vérification de la longueur minimale
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Étape de sécurité optionnelle : vérifier le mot de passe actuel en tentant de se re-authentifier
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error("Utilisateur non authentifié.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Le mot de passe actuel est incorrect.");
      }

      // 3. Mise à jour effective vers Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage({ type: "success", text: "Votre mot de passe a été mis à jour avec succès !" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || une erreur est survenue. });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
          <Lock size={22} />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white">Sécurité et Mot de passe</h3>
          <p className="text-xs text-slate-400">Modifiez votre mot de passe d'accès à l'administration</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 border ${
          message.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-5">
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

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Mise à jour en cours..." : "Modifier le mot de passe"}
          </button>
        </div>
      </form>
    </div>
  );
}