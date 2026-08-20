import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import GaleriePlein from "@/components/GaleriePlein";
import { getGalerieMedia, mediaPublicUrl } from "@/lib/contents";

export const metadata: Metadata = {
  title: "Galerie — La vie à ISSET",
  description: "Cours, ateliers, laboratoire, activités, événements et projets étudiants à ISSET.",
};

export default async function GaleriePage() {
  const mediaList = await getGalerieMedia(48);

  // On transmet un objet riche avec une détection sûre des titres, descriptions et types de médias
  const formattedMedia = mediaList.map((m: any) => {
    const url = mediaPublicUrl(m.bucket, m.path);
    
    // Détection robuste du type de média
    const isVideo = 
      m.type === "video" || 
      (url && (url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm") || url.endsWith(".ogg")));
      
    const isPdf = 
      m.type === "pdf" || 
      (url && url.toLowerCase().endsWith(".pdf"));

    // Récupération sécurisée du titre et de la description (depuis contents ou directement depuis le média)
    const titreFinal = m.titre || m.contents?.titre || "";
    const descriptionFinale = m.description || m.contents?.description || "";

    return {
      id: m.id,
      src: url,
      mediaUrl: url,
      type: isVideo ? "video" : isPdf ? "pdf" : "image",
      alt: titreFinal || "Média ISSET",
      titre: titreFinal,
      description: descriptionFinale,
    };
  });

  return (
    <section className="bg-brume-100 pb-24 pt-36 sm:pt-44">
      <div className="container-isset">
        <Reveal>
          <span className="section-label">La vie à ISSET</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-nuit-950">
            Galerie
          </h1>
          <p className="mt-4 max-w-2xl text-nuit-600">
            Cours, ateliers, laboratoire, activités, événements et projets étudiants.
          </p>
        </Reveal>

        <div className="mt-14">
          {formattedMedia.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-nuit-900/15 p-16 text-center text-nuit-500">
              Aucun média publié pour le moment. Les photos, vidéos et documents
              ajoutés depuis l'espace administrateur apparaîtront ici.
            </div>
          ) : (
            <GaleriePlein images={formattedMedia} />
          )}
        </div>
      </div>
    </section>
  );
}