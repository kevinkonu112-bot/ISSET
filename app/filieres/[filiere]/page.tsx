"use client";

import { FILIERES, getSeriesByFiliere } from "@/lib/data";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Cpu, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

interface PageProps {
  params: Promise<{
    filiere: string;
  }>;
}

export default async function FiliereDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const filiereSlug = resolvedParams.filiere;

  const currentFiliere = FILIERES.find((f) => f.slug === filiereSlug);

  if (!currentFiliere) {
    notFound();
  }

  const seriesList = getSeriesByFiliere(filiereSlug);

  const bannerImage =
    filiereSlug === "economique"
      ? "/images/filieres/banniere-economique.png"
      : "/images/filieres/banniere-industrielle.png";

  return (
    <ClientPageContent
      currentFiliere={currentFiliere}
      seriesList={seriesList}
      bannerImage={bannerImage}
    />
  );
}

// Composant client pour gérer le retour en arrière dynamique
function ClientPageContent({ currentFiliere, seriesList, bannerImage }: any) {
  const router = useRouter();

  return (
    <div className="w-full">
      {/* =========================================================
          EN-TÊTE PLEINE LARGEUR (Hero clair et épuré)
          ========================================================= */}
      <section className="relative w-full bg-nuit-950 pb-20 pt-36 sm:pt-44 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-55"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        <div className="absolute inset-0 bg-nuit-950/40 backdrop-blur-[1px]" />

        <div className="container-isset relative z-10">
          <Reveal>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors mb-6 cursor-pointer bg-transparent border-none p-0"
            >
              <ArrowLeft size={16} />
              Retour
            </button>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="max-w-3xl font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Choisissez votre filière, découvrez votre série.
            </h1>
            <p className="mt-4 max-w-2xl text-white/90 text-base sm:text-lg leading-relaxed">
              ISSET propose des formations adaptées pour votre avenir professionnel. Explorez les détails de la filière sélectionnée ci-dessous.
            </p>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          CONTENU SUR FOND CLAIR AVEC BLOC SOMBRE (Style P1)
          ========================================================= */}
      <section className="bg-brume-100 py-16 w-full">
        <div className="container-isset">
          {/* Bloc rectangulaire au design sombre (style P1) */}
          <div className="mb-14 rounded-3xl border border-cyan-500/40 bg-nuit-950 text-white p-6 sm:p-8 shadow-glow">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                {currentFiliere.slug === "economique" ? <GraduationCap size={28} /> : <Cpu size={28} />}
              </span>
              <div>
                <span className="inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
                  Filière d'excellence
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {currentFiliere.nom.toLowerCase().startsWith("filière") 
                    ? currentFiliere.nom 
                    : `Filière ${currentFiliere.nom}`}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80">
                  {currentFiliere.description}
                </p>
              </div>
            </div>
          </div>

          <Reveal delay={200}>
            <h2 className="font-display text-2xl font-bold mb-8 text-nuit-950 border-l-4 border-cyan-500 pl-4">
              Séries proposées dans cette filière
            </h2>
          </Reveal>

          {/* Grille responsive des séries */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {seriesList.map((s: any, idx: number) => (
              <Reveal key={s.slug} delay={300 + idx * 100}>
                <a
                  href={`/filieres/${s.filiereSlug}/${s.slug}`}
                  className="card-premium group flex flex-col bg-white h-full justify-between p-6 rounded-2xl border border-nuit-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <span className="inline-flex w-fit items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 mb-4">
                      {s.code}
                    </span>
                    <h4 className="font-display text-lg font-semibold text-nuit-950">
                      {s.nom}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-nuit-600">
                      {s.resume}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600">
                    Découvrir la série
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}