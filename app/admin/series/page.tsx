"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SerieRow = {
  id: string;
  code: string;
  nom: string;
  description: string | null;
  objectifs: string | null;
};

export default function AdminSeriesPage() {
  const supabase = createClient();
  const [series, setSeries] = useState<SerieRow[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("series")
      .select("id, code, nom, description, objectifs")
      .order("code")
      .then(({ data }) => setSeries(data || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(row: SerieRow) {
    setSavingId(row.id);
    await supabase
      .from("series")
      .update({ description: row.description, objectifs: row.objectifs })
      .eq("id", row.id);
    setSavingId(null);
  }

  function update(id: string, field: "description" | "objectifs", value: string) {
    setSeries((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-nuit-950">Filières & séries</h1>
      <p className="mt-1 text-sm text-nuit-500">
        Complétez la présentation et les objectifs de chaque série. Ces textes
        apparaissent sur les pages publiques.
      </p>

      <div className="mt-8 space-y-5">
        {series.length === 0 && (
          <p className="rounded-2xl border border-dashed border-nuit-900/15 p-8 text-center text-sm text-nuit-400">
            Aucune série trouvée — vérifiez que le script SQL de départ (supabase/schema.sql)
            a bien été exécuté.
          </p>
        )}
        {series.map((s) => (
          <div key={s.id} className="rounded-2xl border border-nuit-900/5 bg-white p-6">
            <h2 className="font-display text-base font-semibold text-nuit-950">
              {s.code} — {s.nom}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-nuit-400">
                  Présentation
                </label>
                <textarea
                  value={s.description || ""}
                  onChange={(e) => update(s.id, "description", e.target.value)}
                  rows={4}
                  className="mt-1.5 w-full rounded-xl border border-nuit-900/10 p-3 text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-nuit-400">
                  Objectifs
                </label>
                <textarea
                  value={s.objectifs || ""}
                  onChange={(e) => update(s.id, "objectifs", e.target.value)}
                  rows={4}
                  className="mt-1.5 w-full rounded-xl border border-nuit-900/10 p-3 text-sm outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <button
              onClick={() => save(s)}
              disabled={savingId === s.id}
              className="btn-primary mt-4"
            >
              {savingId === s.id ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
