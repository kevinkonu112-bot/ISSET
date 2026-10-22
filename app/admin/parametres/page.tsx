"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, KeyRound, CheckCircle2, AlertCircle, Save } from "lucide-react";

const CHAMPS: { cle: string; label: string; multiline?: boolean; placeholder: string }[] = [
  { cle: "adresse", label: "Adresse exacte", placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "email", label: "Email officiel", placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "telephone_secondaire", label: "Autre téléphone", placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "horaires", label: "Horaires d'ouverture", placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "facebook", label: "Lien Facebook", placeholder: "https://facebook.com/..." },
  { cle: "instagram", label: "Lien Instagram", placeholder: "https://instagram.com/..." },
  { cle: "mission", label: "Mission", multiline: true, placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "vision", label: "Vision", multiline: true, placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "valeurs", label: "Valeurs", multiline: true, placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "mot_directeur", label: "Mot du directeur", multiline: true, placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
  { cle: "conditions_admission", label: "Conditions d'admission", multiline: true, placeholder: "[Informations à compléter par l'administration]" },
];

export default function AdminParametresPage() {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ÉTATS POUR LA SÉCURITÉ DU MOT DE PASSE
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    supabase.from("parametres").select("cle, valeur").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((p) => (map[p.cle] = p.valeur || ""));
      setValues(map);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GESTION ENREGISTREMENT PARAMÈTRES SITE
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await Promise.all(
      CHAMPS.map((c) =>
        supabase.from("parametres").upsert({ cle: c.cle, valeur: values[c.cle] || "" })
      )
    );
    setSaving(false);
    setSaved(true);
  }

  // GESTION CHANGEMENT MOT DE PASSE SUPABASE
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdStatus(null);

    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }

    if (newPassword.length < 6) {
      setPwdStatus({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 6 caractères." });
      return;
    }

    setPwdLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        throw new Error("Impossible de vérifier la session utilisateur.");
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (authError) {
        throw new Error("Le mot de passe actuel saisi est incorrect.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setPwdStatus({ type: "success", text: "Votre mot de passe a été modifié avec succès !" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification du mot de passe.";
      setPwdStatus({ type: "error", text: errorMessage });
    } finally {
      setPwdLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* SECTION 1 : INFORMATIONS & TEXTES SITE */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Paramètres généraux</h1>
        <p className="mt-1 text-sm text-slate-600">
          Coordonnées, réseaux sociaux et textes institutionnels affichés sur le site public.
        </p>

        <form onSubmit={handleSave} className="mt-8 grid gap-5 sm:grid-cols-2">
          {CHAMPS.map((champ) => (
            <div key={champ.cle} className={champ.multiline ? "sm:col-span-2" : ""}>
              <label className="text-sm font-semibold text-slate-800">{champ.label}</label>
              {champ.multiline ? (
                <textarea
                  rows={3}
                  value={values[champ.cle] ?? ""}
                  placeholder={champ.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [champ.cle]: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-cyan-500 placeholder:text-slate-400 shadow-sm"
                />
              ) : (
                <input
                  value={values[champ.cle] ?? ""}
                  placeholder={champ.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [champ.cle]: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-cyan-500 placeholder:text-slate-400 shadow-sm"
                />
              )}
            </div>
          ))}

          <div className="sm:col-span-2 flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>{saving ? "Enregistrement..." : "Enregistrer les paramètres"}</span>
            </button>
            {saved && <span className="text-sm text-emerald-600 font-semibold">Enregistré ✓</span>}
          </div>
        </form>
      </div>

      <hr className="border-slate-200" />

      {/* SECTION 2 : SÉCURITÉ ET CHANGEMENT DE MOT DE PASSE */}
      <div className="max-w-2xl bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Sécurité du compte</h2>
            <p className="text-xs text-slate-400">Modifier votre mot de passe d'accès à l'administration</p>
          </div>
        </div>

        {pwdStatus && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 border ${
              pwdStatus.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {pwdStatus.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{pwdStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Mot de passe actuel
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-500" />
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
              disabled={pwdLoading}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              {pwdLoading ? "Mise à jour en cours..." : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}