"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Cpu, GraduationCap } from "lucide-react";
import { FILIERES, getSeriesByFiliere } from "@/lib/data";

export default function FilieresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // On récupère l'onglet actif depuis l'URL (?tab=industrielle), par défaut "economique"
  const tabParam = searchParams.get("tab");
  const active: "economique" | "industrielle" =
    tabParam === "industrielle" ? "industrielle" : "economique";

  const series = getSeriesByFiliere(active);

  // Fonction pour changer d'onglet et mettre à jour l'URL sans recharger brutalement la page
  const handleTabChange = (slug: "economique" | "industrielle") => {
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
        {/* Image de fond dynamique étirée sur tout l'écran */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${activeBanner})` }}
        />
        {/* Voile léger pour la lisibilité */}
        <div className="absolute inset-0 bg-nuit-950/50 backdrop-blur-[2px]" />

        {/* Contenu du titre */}
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
          CONTENU DES SÉLECTEURS ET DES SÉRIES (En dessous)
         ========================================================= */}
      <section className="bg-brume-100 py-16 w-full">
        <div className="container-isset">
          {/* Les deux rectangles de sélection */}
          <div className="grid gap-5 sm:grid-cols-2">
            {FILIERES.map((filiere) => {
              const isActive = active === filiere.slug;
              return (
                <button
                  key={filiere.slug}
                  onClick={() => handleTabChange(filiere.slug)}
                  aria-pressed={isActive}
                  className={`group flex items-start gap-5 rounded-3xl border p-8 text-left transition-all duration-500 ${
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

          {/* Grille dynamique des séries en dessous */}
          <div
            key={active}
            className="mt-10 grid animate-fade-up gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {series.map((s) => (
              <div
                key={s.slug}
                className="flex flex-col rounded-3xl border border-nuit-900/10 bg-white p-8 shadow-sm transition-all"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600">
                  {s.code}
                </span>
                <h4 className="mt-4 font-display text-lg font-semibold text-nuit-950">
                  {s.nom}
                </h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-nuit-600">{s.resume}</p>
                
                <div className="mt-6">
                  <Link
                    href={`/filieres/${s.filiereSlug}/${s.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Découvrir la série
                    <ArrowRight size={16} className="transition-transform hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}