"use client";

import { useState } from "react";
import { FileText, ImageIcon, Download, Eye, X, ExternalLink } from "lucide-react";

type ContentItem = {
  id: string;
  titre: string;
  description: string | null;
  media?: { bucket: string; path: string }[];
};

export default function SerieMediaInteractive({
  pdfs,
  images,
}: {
  pdfs: ContentItem[];
  images: ContentItem[];
}) {
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string>("");

  const [activeImgUrl, setActiveImgUrl] = useState<string | null>(null);
  const [activeImgTitle, setActiveImgTitle] = useState<string>("");
  const [activeImgDesc, setActiveImgDesc] = useState<string | null>(null);

  function getPublicUrl(bucket: string, path: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ydcghnhzptilpxqchuvl.supabase.co";
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  }

  return (
    <>
      {/* SECTION DOCUMENTS PDF */}
      <section className="border-t border-slate-200 bg-brume-100 py-20">
        <div className="container-isset">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900">
            <FileText size={22} className="text-cyan-600" /> Documents PDF
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pdfs.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 bg-white">
                Aucun document PDF publié pour cette série pour le moment.
              </div>
            )}

            {pdfs.map((p) => {
              const url = p.media?.[0] ? getPublicUrl(p.media[0].bucket, p.media[0].path) : "#";
              const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-cyan-500 transition-all">
                  
                  {/* ZONE D'APERÇU VISUEL DIRECT DU PDF */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden group">
                    {p.media?.[0] ? (
                      <iframe
                        src={googleViewerUrl}
                        className="h-full w-full border-none opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none"
                        title={p.titre}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <FileText size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition" />
                  </div>

                  {/* TITRE ET DESCRIPTION */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">{p.titre}</h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {p.description || "Aucune description saisie pour ce document."}
                      </p>
                    </div>

                    {/* BOUTONS D'ACTIONS */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePdfUrl(url);
                          setActivePdfTitle(p.titre);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-50 text-cyan-700 font-semibold text-xs hover:bg-cyan-100 transition cursor-pointer"
                      >
                        <Eye size={14} /> Grand Aperçu
                      </button>

                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        title="Ouvrir directement"
                      >
                        <ExternalLink size={16} />
                      </a>

                      <a
                        href={url}
                        download
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        title="Télécharger"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION GALERIE */}
      <section className="bg-white py-20">
        <div className="container-isset">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900">
            <ImageIcon size={22} className="text-cyan-600" /> Galerie d'images
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 bg-white">
                Aucune image publiée pour cette série pour le moment.
              </div>
            )}

            {images.map((img) => {
              const url = img.media?.[0] ? getPublicUrl(img.media[0].bucket, img.media[0].path) : null;
              return (
                <div key={img.id} className="group bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-cyan-500 transition-all">
                  {url && (
                    <div
                      onClick={() => {
                        setActiveImgUrl(url);
                        setActiveImgTitle(img.titre);
                        setActiveImgDesc(img.description);
                      }}
                      className="relative aspect-4/3 w-full overflow-hidden bg-slate-200 cursor-pointer"
                    >
                      <img
                        src={url}
                        alt={img.titre}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="bg-slate-950/70 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
                          <Eye size={14} /> Agrandir
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold text-slate-900">{img.titre}</h3>
                    {img.description && (
                      <p className="mt-1 text-xs text-slate-600 leading-snug line-clamp-2">{img.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODALE VISIONNEUSE LECTEUR PDF INTÉGRÉ EN GRAND */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative h-[90vh] w-full max-w-5xl rounded-2xl bg-slate-900 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
              <h3 className="font-display text-base font-bold truncate pr-4">{activePdfTitle}</h3>
              <div className="flex items-center gap-3">
                <a
                  href={activePdfUrl}
                  download
                  className="flex items-center gap-1 text-xs font-semibold bg-cyan-600 px-3 py-1.5 rounded-lg text-white hover:bg-cyan-500 transition"
                >
                  <Download size={14} /> Télécharger
                </a>
                <button
                  type="button"
                  onClick={() => setActivePdfUrl(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-800">
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(activePdfUrl)}&embedded=true`}
                className="h-full w-full border-none"
                title={activePdfTitle}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALE VISIONNEUSE IMAGE PLEIN ÉCRAN (LIGHTBOX) */}
      {activeImgUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] max-w-4xl w-full rounded-2xl bg-slate-900 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
              <div>
                <h3 className="font-display text-base font-bold">{activeImgTitle}</h3>
                {activeImgDesc && <p className="text-xs text-slate-400 mt-0.5">{activeImgDesc}</p>}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activeImgUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold bg-cyan-600 px-3 py-1.5 rounded-lg text-white hover:bg-cyan-500 transition"
                >
                  <Download size={14} /> Enregistrer
                </a>
                <button
                  type="button"
                  onClick={() => setActiveImgUrl(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-black/50 p-4 overflow-hidden">
              <img src={activeImgUrl} alt={activeImgTitle} className="max-h-[75vh] w-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}