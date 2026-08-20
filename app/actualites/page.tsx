import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { getActualites } from "@/lib/contents";
import ActualitesList from "@/components/ActualitesList";

export const metadata: Metadata = {
  title: "Actualités & événements",
  description: "Rentrée scolaire, examens, concours, cérémonies, sorties pédagogiques et événements à ISSET.",
};

export default async function ActualitesPage() {
  const actualites = await getActualites(50);

  return (
    <section className="bg-brume-100 pb-24 pt-36 sm:pt-44">
      <div className="container-isset">
        <Reveal>
          <span className="section-label">Actualités & événements</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-nuit-950">
            La vie à ISSET
          </h1>
          <p className="mt-4 max-w-2xl text-nuit-600">
            Rentrée scolaire, examens, concours, cérémonies, sorties pédagogiques et annonces
            officielles de l'établissement.
          </p>
        </Reveal>

        {/* On délègue l'affichage dynamique et interactif au composant client */}
        <div className="mt-14">
          <ActualitesList actualites={actualites} />
        </div>
      </div>
    </section>
  );
}