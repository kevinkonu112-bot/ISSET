"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const CHAMPS: { cle: string; label: string; multiline?: boolean }[] = [
  { cle: "adresse", label: "Adresse exacte" },
  { cle: "email", label: "Email officiel" },
  { cle: "telephone_secondaire", label: "Autre téléphone" },
  { cle: "horaires", label: "Horaires d'ouverture" },
  { cle: "facebook", label: "Lien Facebook" },
  { cle: "instagram", label: "Lien Instagram" },
  { cle: "mission", label: "Mission", multiline: true },
  { cle: "vision", label: "Vision", multiline: true },
  { cle: "valeurs", label: "Valeurs", multiline: true },
  { cle: "mot_directeur", label: "Mot du directeur", multiline: true },
  { cle: "conditions_admission", label: "Conditions d'admission", multiline: true },
];

export default function AdminParametresPage() {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("parametres").select("cle, valeur").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((p) => (map[p.cle] = p.valeur || ""));
      setValues(map);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-nuit-950">Paramètres</h1>
      <p className="mt-1 text-sm text-nuit-500">
        Coordonnées, réseaux sociaux et textes institutionnels affichés sur le site public.
      </p>

      <form onSubmit={handleSave} className="mt-8 grid gap-5 sm:grid-cols-2">
        {CHAMPS.map((champ) => (
          <div key={champ.cle} className={champ.multiline ? "sm:col-span-2" : ""}>
            <label className="text-sm font-medium text-nuit-800">{champ.label}</label>
            {champ.multiline ? (
              <textarea
                rows={3}
                value={values[champ.cle] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [champ.cle]: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-nuit-900/10 p-3 text-sm outline-none focus:border-cyan-500"
              />
            ) : (
              <input
                value={values[champ.cle] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [champ.cle]: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-nuit-900/10 p-3 text-sm outline-none focus:border-cyan-500"
              />
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </button>
          {saved && <span className="ml-4 text-sm text-emerald-600">Enregistré ✓</span>}
        </div>
      </form>
    </div>
  );
}
