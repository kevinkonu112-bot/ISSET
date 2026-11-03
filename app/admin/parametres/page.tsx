"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Building, Image as ImageIcon, Upload, CheckCircle2, Pencil, X } from "lucide-react";

const CHAMPS_TEXTE: { cle: string; label: string; multiline?: boolean; placeholder: string }[] = [
  { cle: "a_propos", label: "Présentation générale (À propos)", multiline: true, placeholder: "[À RENSEIGNER PAR L'ADMINISTRATEUR] — présentation générale..." },
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
  { cle: "conditions_admission", label: "Conditions d'admission", multiline: true, placeholder: "[Informations à compléter...]" },
];

export default function AdminParametresPage() {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingDirecteur, setUploadingDirecteur] = useState(false);
  const [uploadingCenseur, setUploadingCenseur] = useState(false);

  useEffect(() => {
    supabase.from("parametres").select("cle, valeur").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach((p) => (map[p.cle] = p.valeur || ""));
      setValues(map);
    });
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const payload = [
      ...CHAMPS_TEXTE.map((c) => ({ cle: c.cle, valeur: values[c.cle] || "" })),
      { cle: "photo_directeur_url", valeur: values["photo_directeur_url"] || "" },
      { cle: "photo_censeur_url", valeur: values["photo_censeur_url"] || "" },
    ];

    const results = await Promise.all(
      payload.map((item) => supabase.from("parametres").upsert(item))
    );

    const error = results.find((r) => r.error)?.error;

    setSaving(false);
    if (!error) {
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 4000);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, targetKey: "photo_directeur_url" | "photo_censeur_url") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetKey === "photo_directeur_url") setUploadingDirecteur(true);
    else setUploadingCenseur(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${targetKey}-${Date.now()}.${fileExt}`;
      const filePath = `parametres/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("isset-media").upload(filePath, file);
      if (uploadError) {
        throw new Error("Erreur Storage : " + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage.from("isset-media").getPublicUrl(filePath);
      setValues((v) => ({ ...v, [targetKey]: publicUrl }));
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'envoi de l'image.");
    } finally {
      if (targetKey === "photo_directeur_url") setUploadingDirecteur(false);
      else setUploadingCenseur(false);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
            <Building className="text-cyan-400" size={28} />
            Paramètres du Site & Textes Officiels
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gérez les coordonnées, la présentation, les photos officielles et les textes institutionnels de l'ISSET.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer shadow-md"
            >
              <Pencil size={15} className="text-cyan-400" />
              <span>Modifier les paramètres</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              <X size={16} className="text-red-400" />
              <span>Annuler</span>
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 size={18} />
          <span>Paramètres enregistrés et mis à jour avec succès sur le site officiel !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-white">
        <div className="grid gap-6 sm:grid-cols-2 pb-6 border-b border-slate-800">
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ImageIcon size={16} className="text-cyan-400" /> Photo officielle du Directeur
            </label>
            <div className="flex items-center gap-4">
              {values["photo_directeur_url"] ? (
                <img src={values["photo_directeur_url"]} alt="Directeur" className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500">Aucune</div>
              )}
              {isEditing ? (
                <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
                  <Upload size={16} className="text-cyan-400" />
                  <span>{uploadingDirecteur ? "Envoi..." : "Choisir une photo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "photo_directeur_url")} disabled={uploadingDirecteur} />
                </label>
              ) : (
                <span className="text-xs text-slate-400 italic">Mode lecture seule</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ImageIcon size={16} className="text-cyan-400" /> Photo officielle du Censeur
            </label>
            <div className="flex items-center gap-4">
              {values["photo_censeur_url"] ? (
                <img src={values["photo_censeur_url"]} alt="Censeur" className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500">Aucune</div>
              )}
              {isEditing ? (
                <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
                  <Upload size={16} className="text-cyan-400" />
                  <span>{uploadingCenseur ? "Envoi..." : "Choisir une photo"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "photo_censeur_url")} disabled={uploadingCenseur} />
                </label>
              ) : (
                <span className="text-xs text-slate-400 italic">Mode lecture seule</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {CHAMPS_TEXTE.map((champ) => (
            <div key={champ.cle} className={champ.multiline ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {champ.label}
              </label>
              {champ.multiline ? (
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={values[champ.cle] ?? ""}
                  placeholder={champ.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [champ.cle]: e.target.value }))}
                  className={`w-full rounded-xl border p-3.5 text-sm outline-none transition shadow-inner ${
                    isEditing 
                      ? "border-slate-700 bg-slate-950 text-white focus:border-cyan-500 cursor-text" 
                      : "border-slate-800/60 bg-slate-950/40 text-slate-400 cursor-not-allowed select-none"
                  }`}
                />
              ) : (
                <input
                  disabled={!isEditing}
                  value={values[champ.cle] ?? ""}
                  placeholder={champ.placeholder}
                  onChange={(e) => setValues((v) => ({ ...v, [champ.cle]: e.target.value }))}
                  className={`w-full rounded-xl border p-3.5 text-sm outline-none transition shadow-inner ${
                    isEditing 
                      ? "border-slate-700 bg-slate-950 text-white focus:border-cyan-500 cursor-text" 
                      : "border-slate-800/60 bg-slate-950/40 text-slate-400 cursor-not-allowed select-none"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800 animate-in fade-in duration-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              <span>{saving ? "Enregistrement en cours..." : "Enregistrer les modifications"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}