import Link from "next/link";
import { FileStack, Newspaper, Video, FileText, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ count: total }, { count: videos }, { count: pdfs }, { count: actus }, { data: recents }] =
    await Promise.all([
      supabase.from("contents").select("*", { count: "exact", head: true }),
      supabase.from("contents").select("*", { count: "exact", head: true }).eq("type", "video"),
      supabase.from("contents").select("*", { count: "exact", head: true }).eq("type", "pdf"),
      supabase
        .from("contents")
        .select("*", { count: "exact", head: true })
        .in("type", ["evenement", "annonce"]),
      supabase
        .from("contents")
        .select("id, titre, type, statut, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const stats = [
    { label: "Contenus totaux", value: total ?? 0, icon: FileStack },
    { label: "Vidéos", value: videos ?? 0, icon: Video },
    { label: "Documents PDF", value: pdfs ?? 0, icon: FileText },
    { label: "Actualités / annonces", value: actus ?? 0, icon: Newspaper },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-nuit-950">Tableau de bord</h1>
      <p className="mt-1 text-sm text-nuit-500">Vue d'ensemble du contenu publié sur le site.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-nuit-900/5 bg-white p-6 shadow-sm">
            <s.icon size={20} className="text-cyan-600" />
            <p className="mt-4 font-display text-3xl font-bold text-nuit-950">{s.value}</p>
            <p className="mt-1 text-sm text-nuit-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-nuit-900/5 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-nuit-950">
            Publications récentes
          </h2>
          <Link href="/admin/contenus" className="flex items-center gap-1 text-sm font-semibold text-cyan-600">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-nuit-900/5">
          {(!recents || recents.length === 0) && (
            <p className="py-6 text-sm text-nuit-400">
              Aucun contenu pour le moment — configurez Supabase puis créez votre premier
              contenu depuis « Contenus ».
            </p>
          )}
          {recents?.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-nuit-800">{r.titre}</p>
                <p className="text-xs uppercase tracking-wider text-nuit-400">{r.type}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  r.statut === "publie"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : r.statut === "archive"
                    ? "bg-nuit-900/5 text-nuit-500"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {r.statut}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
