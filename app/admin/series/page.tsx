"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Edit3, Check, X, ExternalLink, Lock } from "lucide-react";

type SerieRow = {
  id: string;
  code: string;
  nom: string;
  slug: string;
  filiere_id?: string;
  description: string | null;
  objectifs: string | null;
  updated_at?: string | null;
};

export default function AdminSeriesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [series, setSeries] = useState<SerieRow[]>([]);
  
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Record<string, { description: string; objectifs: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ code: string; text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSeries() {
    const { data, error } = await supabase
      .from("series")
      .select("id, code, nom, slug, filiere_id, description, objectifs, updated_at")
      .order("code");

    if (error) {
      console.error("Erreur lors de la récupération des séries :", error);
    } else {
      const list = data || [];
      setSeries(list);
      const map: Record<string, { description: string; objectifs: string }> = {};
      list.forEach((s) => {
        map[s.code] = {
          description: s.description || "",
          objectifs: s.objectifs || "",
        };
      });
      setInitialData(map);
    }
  }

  function handleEdit(s: SerieRow) {
    setEditingCode(s.code);
    setMessage(null);
  }

  function handleCancel(s: SerieRow) {
    const original = initialData[s.code];
    if (original) {
      setSeries((prev) =>
        prev.map((item) =>
          item.code === s.code
            ? { ...item, description: original.description, objectifs: original.objectifs }
            : item
        )
      );
    }
    setEditingCode(null);
    setMessage(null);
  }

  function updateField(code: string, field: "description" | "objectifs", value: string) {
    setSeries((prev) =>
      prev.map((s) => (s.code === code ? { ...s, [field]: value } : s))
    );
  }

  function hasChanges(s: SerieRow) {
    const original = initialData[s.code];
    if (!original) return false;
    return (
      (s.description || "") !== original.description ||
      (s.objectifs || "") !== original.objectifs
    );
  }

  // Détermine le lien public en fonction du code/filière
  function getPublicUrl(s: SerieRow) {
    const isIndustrial = ["F2", "F3", "F4"].includes(s.code);
    const filiereSlug = isIndustrial ? "industrielle" : "economique";
    return `/filieres/${filiereSlug}/${s.slug}`;
  }

  async function handleSave(s: SerieRow) {
    setIsSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("series")
      .update({
        description: s.description,
        objectifs: s.objectifs,
        updated_at: new Date().toISOString(),
      })
      .eq("code", s.code);

    setIsSaving(false);

    if (error) {
      console.error("Erreur Supabase Update :", error);
      setMessage({
        code: s.code,
        text: `Échec de l'enregistrement : ${error.message}`,
        type: "error",
      });
    } else {
      setInitialData((prev) => ({
        ...prev,
        [s.code]: {
          description: s.description || "",
          objectifs: s.objectifs || "",
        },
      }));

      setEditingCode(null);

      setMessage({
        code: s.code,
        text: "Informations enregistrées et publiées avec succès !",
        type: "success",
      });

      router.refresh();
      setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Gestion des Présentations & Objectifs
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gérez les programmes pédagogiques affichés sur les pages publiques de chaque série.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {series.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 bg-white">
            Aucune série trouvée dans la base de données.
          </div>
        )}

        {series.map((s) => {
          const isEditing = editingCode === s.code;
          const changed = hasChanges(s);
          const publicUrl = getPublicUrl(s);

          return (
            <div
              key={s.id || s.code}
              className={`rounded-2xl border transition-all duration-200 bg-white p-6 shadow-sm ${
                isEditing
                  ? "border-cyan-500 ring-2 ring-cyan-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white uppercase tracking-wider">
                    {s.code}
                  </span>
                  <div>
                    <h2 className="font-display text-base font-semibold text-slate-900">
                      Série {s.code} — {s.nom}
                    </h2>
                    {s.updated_at && (
                      <p className="text-xs text-slate-400">
                        Dernière mise à jour : {new Date(s.updated_at).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bouton Aperçu Public Direct */}
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-cyan-600 hover:bg-slate-50 transition"
                    title="Voir la page publique dans un nouvel onglet"
                  >
                    <ExternalLink size={14} />
                    <span className="hidden sm:inline">Aperçu public</span>
                  </a>

                  {!isEditing ? (
                    <button
                      onClick={() => handleEdit(s)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                    >
                      <Edit3 size={14} className="text-slate-500" />
                      Modifier
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCancel(s)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <X size={14} /> Annuler
                      </button>

                      <button
                        onClick={() => handleSave(s)}
                        disabled={!changed || isSaving}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
                          changed && !isSaving
                            ? "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-sm"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <Check size={14} />
                        {isSaving ? "Enregistrement..." : "Enregistrer"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message && message.code === s.code && (
                <div
                  className={`mt-4 p-3 text-xs rounded-xl border font-medium ${
                    message.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                      {!isEditing && <Lock size={12} className="text-slate-400" />} Présentation
                    </label>
                  </div>
                  <textarea
                    value={s.description || ""}
                    disabled={!isEditing}
                    onChange={(e) => updateField(s.code, "description", e.target.value)}
                    rows={5}
                    className={`w-full rounded-xl p-3 text-sm transition duration-150 outline-none ${
                      isEditing
                        ? "bg-white border border-slate-300 text-slate-950 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                        : "bg-slate-50 border border-slate-200 text-slate-600 cursor-not-allowed select-none opacity-80"
                    }`}
                    placeholder={isEditing ? "Tapez la présentation détaillée de la série..." : "Aucune présentation renseignée."}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                      {!isEditing && <Lock size={12} className="text-slate-400" />} Objectifs de la série
                    </label>
                  </div>
                  <textarea
                    value={s.objectifs || ""}
                    disabled={!isEditing}
                    onChange={(e) => updateField(s.code, "objectifs", e.target.value)}
                    rows={5}
                    className={`w-full rounded-xl p-3 text-sm transition duration-150 outline-none ${
                      isEditing
                        ? "bg-white border border-slate-300 text-slate-950 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                        : "bg-slate-50 border border-slate-200 text-slate-600 cursor-not-allowed select-none opacity-80"
                    }`}
                    placeholder={isEditing ? "Tapez les objectifs pédagogiques de la série..." : "Aucun objectif renseigné."}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}