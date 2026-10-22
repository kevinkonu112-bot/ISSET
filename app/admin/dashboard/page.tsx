import Link from "next/link";
import { FileStack, Newspaper, Video, FileText, ArrowRight, Globe, ExternalLink } from "lucide-react";
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
    <div className="space-y-8 pb-10">
      {/* BANNIÈRE D'ACCUEIL ADMIN AVEC BOUTON "VOIR LE SITE EN DIRECT" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-nuit-950 via-slate-900 to-nuit-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" /> Espace Directeur / Administration
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl">
              Vue d'ensemble du contenu publié et gestion de la plateforme ISSET en temps réel.
            </p>
          </div>

          {/* BOUTON D'ACCÈS RAPIDE VERS LA PAGE D'ACCUEIL DU SITE */}
          <div className="shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/30 transition transform hover:-translate-y-0.5 cursor-pointer w-full md:w-auto"
            >
              <Globe size={18} />
              <span>Voir le site en direct</span>
              <ExternalLink size={15} className="opacity-80" />
            </Link>
          </div>
        </div>

        {/* Halo décoratif lumineux */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* STATISTIQUES */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-nuit-900/5 bg-white p-6 shadow-xs hover:border-cyan-500/30 transition">
            <s.icon size={20} className="text-cyan-600" />
            <p className="mt-4 font-display text-3xl font-bold text-nuit-950">{s.value}</p>
            <p className="mt-1 text-sm text-nuit-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* PUBLICATIONS RÉCENTES */}
      <div className="rounded-2xl border border-nuit-900/5 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-nuit-950">
            Publications récentes
          </h2>
          <Link href="/admin/contenus" className="flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700">
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