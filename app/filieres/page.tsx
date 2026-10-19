"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { ArrowRight, Cpu, GraduationCap, Search, X } from "lucide-react";
import { FILIERES, getSeriesByFiliere } from "@/lib/data";

function FilieresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // On récupère l'onglet actif depuis l'URL (?tab=industrielle), par défaut "economique"
  const tabParam = searchParams.get("tab");
  const active: "economique" | "industrielle" =
    tabParam === "industrielle" ? "industrielle" : "economique";

  const rawSeries = getSeriesByFiliere(active);

  // État pour la recherche dynamique instantanée
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrage intelligent des séries en fonction de la saisie utilisateur
  const series = useMemo(() => {
    if (!searchQuery.trim()) return rawSeries;
    const query = searchQuery.toLowerCase().trim();
    return rawSeries.filter(
      (s) =>
        s.nom.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        (s.resume && s.resume.toLowerCase().includes(query))
    );
  }, [rawSeries, searchQuery]);

  // Fonction pour changer d'onglet et réinitialiser la recherche
  const handleTabChange = (slug: "economique" | "industrielle") => {
    setSearchQuery("");
    router.push(`/filieres?tab=${slug}`, { scroll: false });
  };

  // Image de bannière dynamique pleine largeur
  const activeBanner =
    active === "economique"
      ? "/images/filieres/banniere-economique.png"
      : "/images/filieres/banniere-industrielle.png";

  return (
    <div className="w-full">
      {/* =========================================================
          EN-TÊTE PLEINE LARGEUR (De bord à bord sans aucune marge)
         ========================================================= */}
      <section className="relative w-full bg-nuit-950 pb-20 pt-36 sm:pt-44 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${activeBanner})` }}
        />
        <div className="absolute inset-0 bg-nuit-950/50 backdrop-blur-[2px]" />

        <div className="container-isset relative z-10">
          <h1 className="max-w-3xl font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Choisissez votre filière, découvrez votre série.
          </h1>
          <p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg">
            ISSET propose deux grandes filières réparties en six séries. Sélectionnez une
            filière pour découvrir les séries qui la composent.
          </p>
        </div>
      </section>

      {/* =========================================================
          CONTENU DES SÉLECTEURS, RECHERCHE ET SÉRIES
         ========================================================= */}
      <section className="bg-brume-100 py-16 w-full">
        <div className="container-isset">
          {/* Les deux rectangles de sélection de filière */}
          <div className="grid gap-5 sm:grid-cols-2">
            {FILIERES.map((filiere) => {
              const isActive = active === filiere.slug;
              return (
                <button
                  key={filiere.slug}
                  onClick={() => handleTabChange(filiere.slug)}
                  aria-pressed={isActive}
                  className={`group flex items-start gap-5 rounded-3xl border p-8 text-left transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "border-cyan-500 bg-nuit-950 text-white shadow-glow"
                      : "border-nuit-900/10 bg-white text-nuit-900 hover:border-cyan-400/50"
                  }`}
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                      isActive ? "bg-cyan-400/15 text-cyan-400" : "bg-nuit-900/5 text-nuit-700"
                    }`}
                  >
                    {filiere.slug === "economique" ? <GraduationCap size={26} /> : <Cpu size={26} />}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold">{filiere.nom}</h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        isActive ? "text-white/70" : "text-nuit-600"
                      }`}
                    >
                      {filiere.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* BARRE DE RECHERCHE DYNAMIQUE (Fonctionnalité d'Élite) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-nuit-900/10 shadow-sm">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une série par nom, code ou mots-clés (ex: Électronique, G2...)..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="text-xs font-medium text-slate-500 whitespace-nowrap px-2">
              {series.length} série{series.length > 1 ? "s" : ""} trouvée{series.length > 1 ? "s" : ""}
            </div>
          </div>

          {/* Grille dynamique des séries */}
          <div
            key={active + searchQuery}
            className="mt-6 grid animate-fade-up gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {series.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 bg-white">
                Aucune série ne correspond à votre recherche "<span className="font-semibold text-slate-900">{searchQuery}</span>".
              </div>
            ) : (
              series.map((s) => (
                <div
                  key={s.slug}
                  className="flex flex-col justify-between rounded-3xl border border-nuit-900/10 bg-white p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    <span className="inline-flex w-fit items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600">
                      {s.code}
                    </span>
                    <h4 className="mt-4 font-display text-lg font-semibold text-nuit-950">
                      {s.nom}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-nuit-600">{s.resume}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/filieres/${s.filiereSlug}/${s.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                    >
                      <span>Découvrir la série</span>
                      <ArrowRight size={16} className="transition-transform hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function FilieresPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brume-100 flex items-center justify-center">Chargement...</div>}>
      <FilieresContent />
    </Suspense>
  );
}