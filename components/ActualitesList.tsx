"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { X, FileText, Download } from "lucide-react";

export default function ActualitesList({ actualites }: { actualites: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!actualites || actualites.length === 0) {
    return (
      <div className="col-span-full rounded-2xl border border-dashed border-nuit-900/15 p-16 text-center text-nuit-500">
        Aucune actualité publiée pour le moment. Revenez bientôt !
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actualites.map((a, i) => {
          const mediaUrl = a.image_url || a.image;
          const isVideo = a.type === "video" || (mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl));
          const isPdf = a.type === "pdf" || (mediaUrl && /\.pdf$/i.test(mediaUrl));

          return (
            <Reveal key={a.id || i} delay={(i % 6) * 80}>
              <article className="card-premium h-full flex flex-col overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-nuit-900/10">
                
                {/* --- AFFICHAGE IMAGE (INTÉGRALE SANS COUPE) --- */}
                {mediaUrl && !isVideo && !isPdf && (
                  <div 
                    onClick={() => setSelectedImage(mediaUrl)}
                    className="cursor-pointer group relative mb-4 h-56 w-full overflow-hidden rounded-xl bg-nuit-950 flex items-center justify-center"
                    title="Cliquer pour agrandir l'image"
                  >
                    <img 
                      src={mediaUrl} 
                      alt={a.titre || "Actualité"}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                      🔍 Cliquer pour agrandir
                    </div>
                  </div>
                )}

                {/* --- AFFICHAGE VIDÉO --- */}
                {mediaUrl && isVideo && (
                  <div className="relative mb-4 w-full bg-black h-56 rounded-xl overflow-hidden flex items-center justify-center">
                    <video 
                      src={mediaUrl} 
                      controls 
                      preload="metadata"
                      className="w-full h-full object-contain"
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                )}

                {/* --- SI AUCUN MÉDIA VALIDE --- */}
                {!mediaUrl && (
                  <div className="mb-4 h-32 w-full rounded-xl bg-nuit-100 flex items-center justify-center text-nuit-400 text-xs italic">
                    Aucun média associé
                  </div>
                )}

                <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-500/10 text-cyan-600 w-fit mb-2">
                  {a.type || "Annonce"}
                </span>
                
                <h2 className="font-display text-lg font-semibold text-nuit-950">
                  {a.titre}
                </h2>
                
                <p className="mt-2 text-sm leading-relaxed italic text-nuit-700 font-serif">
                  {a.description}
                </p>

                {/* --- FICHIERS PDF --- */}
                {mediaUrl && isPdf && (
                  <div className="mt-4 pt-4 border-t border-nuit-900/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-nuit-700 text-sm font-medium">
                      <FileText size={20} className="text-red-500" />
                      <span>Document PDF</span>
                    </div>
                    <a 
                      href={mediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
                    >
                      <Download size={14} /> Ouvrir
                    </a>
                  </div>
                )}
                
                {a.date_publication && (
                  <p className="mt-auto pt-4 text-xs uppercase tracking-wider text-nuit-400">
                    {new Date(a.date_publication).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* --- MODALE ZOOM IMAGE --- */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative max-w-6xl max-h-[92vh] w-full flex items-center justify-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              title="Fermer"
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Agrandissement" 
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </>
  );
}