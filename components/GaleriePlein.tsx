"use client";

import React, { useState } from "react";

interface MediaItem {
  id?: string;
  src: string;
  type: string; // Type élargi pour accepter toutes les valeurs de l'API
  alt?: string;
  titre?: string;
  title?: string;
  description?: string;
  desc?: string;
  texte?: string;
  contenu?: string;
  [key: string]: any;
}

interface GaleriePleinProps {
  images: MediaItem[];
}

export default function GaleriePlein({ images }: GaleriePleinProps) {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, index) => {
          const displayTitle = item.titre || item.title || "Sans titre";
          const displayDesc = item.description || item.desc || item.texte || item.contenu || "";

          return (
            <div
              key={item.id || index}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-nuit-900/5 transition hover:shadow-xl"
            >
              {/* Contenu Média */}
              <div className="relative h-64 w-full bg-nuit-950 flex items-center justify-center overflow-hidden">
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover bg-black"
                  />
                ) : item.type === "pdf" ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 text-center h-full w-full bg-white border-2 border-nuit-100 transition-colors">
                    <div className="flex flex-col items-center">
                      <span className="text-6xl mb-2">📕</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-nuit-400">PDF Document</span>
                    </div>
                    <a
                      href={item.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-nuit-950 px-6 py-2.5 text-sm font-semibold text-nuit-950 hover:bg-nuit-950 hover:text-white transition-all"
                    >
                      <span>Consulter le fichier</span>
                    </a>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt || displayTitle}
                    onClick={() => setSelectedImage(item)}
                    className="h-full w-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                    title="Cliquez pour agrandir l'image"
                  />
                )}
              </div>

              {/* Bloc Titre et Description */}
              <div className="flex flex-col flex-grow p-5 bg-white gap-2">
                <h3 className="font-display font-bold text-nuit-950 text-base line-clamp-1">
                  {displayTitle}
                </h3>
                {displayDesc ? (
                  <p className="text-sm text-nuit-600 line-clamp-3 leading-relaxed">
                    {displayDesc}
                  </p>
                ) : (
                  <p className="text-xs text-red-500 italic">
                    (Aucune description)
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-nuit-950 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black transition"
            >
              ✕
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || "Image"}
              className="max-h-[80vh] w-auto object-contain rounded-xl mx-auto"
            />
            <div className="p-4 text-white">
              <h3 className="font-display font-bold text-lg">{selectedImage.titre || selectedImage.title}</h3>
              <p className="mt-1 text-sm text-white/80">
                {selectedImage.description || selectedImage.desc || selectedImage.texte || "Pas de description"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}