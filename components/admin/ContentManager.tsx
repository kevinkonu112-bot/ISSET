"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, UploadCloud, Eye, EyeOff, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TYPES = [
  { value: "cours", label: "Cours" },
  { value: "video", label: "Vidéo" },
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Image / Galerie" },
  { value: "annonce", label: "Annonce" },
  { value: "evenement", label: "Événement" },
  { value: "activite", label: "Activité / Projet" },
  { value: "texte", label: "Texte" },
];

type ContentRow = {
  id: string;
  titre: string;
  slug: string;
  description: string | null;
  type: string;
  statut: string;
  serie_id: string | null;
  created_at: string;
};

export default function ContentManager({ restrictType }: { restrictType?: string }) {
  const supabase = createClient();
  const [items, setItems] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ContentRow | null>(null);

  async function load() {
    setLoading(true);
    let query = supabase.from("contents").select("*").order("created_at", { ascending: false });
    if (restrictType === "actualites") query = query.in("type", ["annonce", "evenement"]);
    else if (restrictType === "galerie") query = query.eq("type", "image");
    const { data } = await query;
    setItems((data as ContentRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleStatut(item: ContentRow) {
    const next = item.statut === "publie" ? "brouillon" : "publie";
    await supabase.from("contents").update({ statut: next, date_publication: next === "publie" ? new Date().toISOString() : null }).eq("id", item.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce contenu ?")) return;
    
    const { error } = await supabase.from("contents").delete().eq("id", id);
    
    if (error) {
      alert("Erreur : " + error.message);
    } else {
      load();
    }
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-nuit-950">
            {restrictType === "actualites" ? "Actualités" : restrictType === "galerie" ? "Galerie" : "Contenus (cours, vidéos, PDF)"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-nuit-500">
            Créez, modifiez, publiez ou dépubliez vos contenus.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm w-full sm:w-auto shadow-md"
        >
          <Plus size={16} /> Nouveau contenu
        </button>
      </div>

      {/* Conteneur de tableau unifié avec scroll horizontal natif fluide */}
      <div className="w-full bg-white rounded-2xl border border-nuit-900/5 shadow-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-nuit-900/[0.02] border-b border-nuit-900/5 text-[11px] font-semibold uppercase tracking-wider text-nuit-400">
              <tr>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nuit-900/5">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-nuit-400">Chargement...</td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-nuit-400">Aucun contenu trouvé.</td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-6 py-4 font-semibold text-nuit-900">{item.titre}</td>
                  <td className="px-6 py-4 text-xs text-nuit-500">
                    {TYPES.find((t) => t.value === item.type)?.label || item.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.statut === "publie" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                      {item.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleStatut(item)} 
                        title={item.statut === "publie" ? "Dépublier" : "Publier"} 
                        className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        {item.statut === "publie" ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button 
                        onClick={() => { setEditing(item); setFormOpen(true); }} 
                        title="Modifier" 
                        className="p-2 rounded-xl text-cyan-600 bg-cyan-50 hover:bg-cyan-100 transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => remove(item.id)} 
                        title="Supprimer" 
                        className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <ContentForm
          initial={editing}
          defaultType={restrictType === "actualites" ? "annonce" : restrictType === "galerie" ? "image" : undefined}
          onClose={() => setFormOpen(false)}
          onSaved={() => { setFormOpen(false); load(); }}
        />
      )}
    </div>
  );
}

function ContentForm({
  initial,
  defaultType,
  onClose,
  onSaved,
}: {
  initial: ContentRow | null;
  defaultType?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [titre, setTitre] = useState(initial?.titre || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [type, setType] = useState(initial?.type || defaultType || "cours");
  const [serieId, setSerieId] = useState(initial?.serie_id || "");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [seriesOptions, setSeriesOptions] = useState<{ id: string; nom: string; code: string }[]>([]);

  useEffect(() => {
    supabase.from("series").select("id, nom, code").then(({ data }) => setSeriesOptions(data || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    const slug = `${slugify(titre)}-${Date.now().toString(36)}`;

    let contentId = initial?.id;

    if (initial) {
      await supabase
        .from("contents")
        .update({ titre, description, type, serie_id: serieId || null })
        .eq("id", initial.id);
    } else {
      const { data, error } = await supabase
        .from("contents")
        .insert({ titre, description, type, serie_id: serieId || null, slug, auteur_id: user?.id, statut: "brouillon" })
        .select()
        .single();
      if (error) {
        alert("Erreur : " + error.message);
        setSaving(false);
        return;
      }
      contentId = data.id;
    }

    if (file && contentId) {
      const ext = file.name.split(".").pop();
      const path = `${type}/${contentId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("isset-media")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        setProgress(100);

        const { data: publicUrlData } = supabase.storage
          .from("isset-media")
          .getPublicUrl(path);

        const imageUrl = publicUrlData.publicUrl;

        await supabase
          .from("contents")
          .update({ image: imageUrl })
          .eq("id", contentId);

        await supabase.from("media").insert({
          content_id: contentId,
          bucket: "isset-media",
          path,
          type: type === "video" ? "video" : type === "pdf" ? "pdf" : "image",
          taille_octets: file.size,
          nom_original: file.name,
        });
      } else {
        alert("Le contenu a été enregistré mais l'upload du fichier a échoué : " + uploadError.message);
      }
    }

    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-nuit-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 text-nuit-950 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-nuit-950">
            {initial ? "Modifier le contenu" : "Nouveau contenu"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-nuit-400 hover:bg-nuit-900/5">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-nuit-800">Titre</label>
            <input required value={titre} onChange={(e) => setTitre(e.target.value)} className="input mt-1.5" placeholder="Ex: Cours de géodésie..." />
          </div>

          <div>
            <label className="text-sm font-medium text-nuit-800">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input mt-1.5" placeholder="Brève description..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-nuit-800">Type de contenu</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input mt-1.5">
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-nuit-800">Série associée</label>
              <select value={serieId} onChange={(e) => setSerieId(e.target.value)} className="input mt-1.5">
                <option value="">— Aucune —</option>
                {seriesOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.code} — {s.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-nuit-800">Fichier (image, PDF ou vidéo)</label>
            <label className="mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-nuit-900/15 px-4 py-6 text-center text-sm text-nuit-600 hover:border-cyan-400 bg-gray-50/50">
              <UploadCloud size={20} className="text-cyan-500" />
              {file ? file.name : "Cliquez pour sélectionner un fichier"}
              <input
                type="file"
                accept="image/*,application/pdf,video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {saving && file && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-nuit-900/10">
                <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="w-full py-3 disabled:opacity-60 btn-primary">
            {saving ? "Enregistrement..." : initial ? "Enregistrer" : "Créer le contenu"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(11, 27, 58, 0.15);
          background-color: #f8fafc;
          color: #0b1b3a;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #12b5d6;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(18, 181, 214, 0.15);
        }
      `}</style>
    </div>
  );
}