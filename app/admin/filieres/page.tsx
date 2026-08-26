"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Serie = {
  id: string;
  nom: string;
  code: string;
  description: string | null;
  presentation: string | null;
};

export default function AdminFilieresPage() {
  const supabase = createClient();
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Serie | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("series").select("*").order("nom");
    setSeries((data as Serie[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Supprimer cette filière/série ?")) return;
    await supabase.from("series").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0b0f19] text-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">Filières & Séries</h1>
          <p className="mt-1 text-sm text-gray-400">Gérez les filières de formation et leurs présentations affichées sur le site.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} /> Nouvelle filière
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] shadow-2xl">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-[#161f32] text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Nom de la filière</th>
              <th className="px-6 py-4">Description / Présentation</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-gray-300">
            {loading && <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">Chargement...</td></tr>}
            {!loading && series.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">Aucune filière enregistrée.</td></tr>}
            {series.map((s) => (
              <tr key={s.id} className="hover:bg-gray-800/40 transition">
                <td className="px-6 py-4 font-mono font-bold text-cyan-400">{s.code}</td>
                <td className="px-6 py-4 font-medium text-white">{s.nom}</td>
                <td className="px-6 py-4 text-gray-400 truncate max-w-xs">{s.presentation || s.description || "—"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => { setEditing(s); setFormOpen(true); }} className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => remove(s.id)} className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <SerieForm initial={editing} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); load(); }} />
      )}
    </div>
  );
}

function SerieForm({ initial, onClose, onSaved }: { initial: Serie | null; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const [nom, setNom] = useState(initial?.nom || "");
  const [code, setCode] = useState(initial?.code || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [presentation, setPresentation] = useState(initial?.presentation || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (initial) {
      await supabase.from("series").update({ nom, code, description, presentation }).eq("id", initial.id);
    } else {
      await supabase.from("series").insert({ nom, code, description, presentation });
    }
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-gray-800 p-6 md:p-8 shadow-2xl text-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">{initial ? "Modifier la filière" : "Nouvelle filière"}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300">Nom de la filière</label>
            <input required value={nom} onChange={(e) => setNom(e.target.value)} className="w-full mt-1.5 rounded-xl border border-gray-700 bg-[#161f32] px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Code (ex: GL, RIT, Topographie)</label>
            <input required value={code} onChange={(e) => setCode(e.target.value)} className="w-full mt-1.5 rounded-xl border border-gray-700 bg-[#161f32] px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Description courte</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full mt-1.5 rounded-xl border border-gray-700 bg-[#161f32] px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Présentation détaillée (affichée directement sur le site)</label>
            <textarea value={presentation} onChange={(e) => setPresentation(e.target.value)} rows={4} className="w-full mt-1.5 rounded-xl border border-gray-700 bg-[#161f32] px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none" placeholder="Texte de présentation complet..." />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/20">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}