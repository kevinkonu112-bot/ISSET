"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Cpu, GraduationCap } from "lucide-react";
import { FILIERES, getSeriesByFiliere } from "@/lib/data";

export default function FilieresExplorer() {
  const [active, setActive] = useState<"economique" | "industrielle">("economique");
  const series = getSeriesByFiliere(active);

  // Image de bannière dynamique pleine largeur selon la filière active
  const activeBanner =
    active === "economique"
      ? "/images/filieres/banniere-economique.png"
      : "/images/filieres/banniere-industrielle.png";

  return (
    <div id="explorateur">
      {/* =========================================================
          1. EN-TÊTE PLEINE LARGEUR (Full Width) AVEC LA BANNIÈRE
         ========================================================= */}
      <section className="relative w-full bg-nuit-950 pb-20 pt-36 sm:pt-44 text-white overflow-hidden">
        {/* Image de fond dynamique qui s'étale sur tout l'écran */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${activeBanner})` }}
        />
        {/* Voile léger pour garder la lisibilité sans cacher l'image */}
        <div className="absolute inset-0 bg-nuit-950/60 backdrop-blur-[2px]" />

        {/* Contenu centré du header */}
        <div className="container-isset relative z-10">
          <span className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
            02 — Nos filières
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Choisissez votre filière, découvrez votre série.
          </h1>
          <p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg">
            ISSET propose deux grandes filières réparties en six séries. Sélectionnez une
            filière pour découvrir les séries qui la composent.
          </p>
        </div>
      </section>

      {/* =========================================================
          2. CONTENU DES SÉLECTEURS ET DES SÉRIES
         ========================================================= */}
      <section className="bg-brume-100 py-16">
        <div className="container-isset">
          {/* Les deux rectangles de sélection */}
          <div className="grid gap-5 sm:grid-cols-2">
            {FILIERES.map((filiere) => {
              const isActive = active === filiere.slug;
              return (
                <button
                  key={filiere.slug}
                  onClick={() => setActive(filiere.slug)}
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
              <Link
                key={s.slug}
                href={`/filieres/${s.filiereSlug}/${s.slug}`}
                className="card-premium group flex flex-col bg-white"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600">
                  {s.code}
                </span>
                <h4 className="mt-4 font-display text-lg font-semibold text-nuit-950">
                  {s.nom}
                </h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-nuit-600">{s.resume}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600">
                  Découvrir la série
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}