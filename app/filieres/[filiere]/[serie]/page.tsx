import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Film, ImageIcon, CheckCircle2, ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SERIES, whatsappHref } from "@/lib/data";
import { getPublishedContents, mediaPublicUrl } from "@/lib/contents";

export function generateStaticParams() {
  return SERIES.map((s) => ({ filiere: s.filiereSlug, serie: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { filiere: string; serie: string };
}): Metadata {
  const serie = SERIES.find((s) => s.slug === params.serie);
  if (!serie) return {};
  return {
    title: `${serie.code} — ${serie.nom}`,
    description: serie.resume,
  };
}

export default async function SeriePage({
  params,
}: {
  params: { filiere: string; serie: string };
}) {
  const serie = SERIES.find((s) => s.slug === params.serie && s.filiereSlug === params.filiere);
  if (!serie) notFound();

  // Chemin dynamique vers l'image unique de la série (ex: /images/series/g1.png, f2.png, etc.)
  const serieImageBg = `/images/series/${serie.code.toLowerCase()}.png`;

  const contenus = await getPublishedContents({ serieSlug: serie.slug });
  const cours = contenus.filter((c) => c.type === "cours");
  const videos = contenus.filter((c) => c.type === "video");
  const pdfs = contenus.filter((c) => c.type === "pdf");
  const images = contenus.filter((c) => c.type === "image");
  const actus = contenus.filter((c) => c.type === "evenement" || c.type === "annonce");

  return (
    <>
      {/* ============ HERO DE LA SÉRIE AVEC SON IMAGE UNIQUE EN ARRIÈRE-PLAN ============ */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-nuit-950 text-white pt-32 pb-20 sm:pt-40">
        {/* Image de fond unique pour la série */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${serieImageBg})` }}
        />
        {/* Voile sombre pour garder le texte parfaitement lisible */}
        <div className="absolute inset-0 bg-nuit-950/85" />

        <div className="container-isset relative z-10">
          <Reveal>
            <Link
              href={`/filieres#${serie.filiereSlug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-6 hover:underline"
            >
              <ArrowLeft size={14} /> Retour à la filière
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-4">
              {serie.filiereSlug === "economique" ? "Filière économique" : "Filière industrielle"}
            </span>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {serie.code} — {serie.nom}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              {serie.resume}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Présentation */}
      <section className="bg-brume-100 py-20">
        <div className="container-isset grid gap-14 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-nuit-950">Présentation</h2>
            <p className="mt-4 leading-relaxed text-nuit-700">
              [À RENSEIGNER PAR L'ADMINISTRATEUR] — présentation détaillée de la série {serie.nom},
              de ses débouchés et de son organisation pédagogique.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="card-premium">
              <h3 className="font-display text-base font-semibold text-nuit-950">
                Compétences développées
              </h3>
              <ul className="mt-4 space-y-3">
                {serie.themes.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-nuit-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cours disponibles */}
      <section className="border-t border-nuit-900/5 bg-white py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-nuit-950">Cours disponibles</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cours.length === 0 && <EtatVide texte="Aucun cours publié pour cette série pour le moment." />}
            {cours.map((c) => (
              <div key={c.id} className="card-premium">
                <h3 className="font-display text-base font-semibold text-nuit-950">{c.titre}</h3>
                <p className="mt-2 text-sm text-nuit-600">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vidéos pédagogiques */}
      <section className="bg-brume-100 py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-nuit-950">
              <Film size={22} className="text-cyan-600" /> Vidéos pédagogiques
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.length === 0 && <EtatVide texte="Aucune vidéo publiée pour cette série pour le moment." />}
            {videos.map((v) => (
              <div key={v.id} className="card-premium">
                <h3 className="font-display text-base font-semibold text-nuit-950">{v.titre}</h3>
                {v.media?.[0] && (
                  <video
                    controls
                    preload="none"
                    className="mt-3 aspect-video w-full rounded-lg bg-nuit-950"
                    src={mediaPublicUrl(v.media[0].bucket, v.media[0].path)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents PDF */}
      <section className="border-t border-nuit-900/5 bg-white py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-nuit-950">
              <FileText size={22} className="text-cyan-600" /> Documents PDF
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pdfs.length === 0 && <EtatVide texte="Aucun document publié pour cette série pour le moment." />}
            {pdfs.map((p) => (
              <a
                key={p.id}
                href={p.media?.[0] ? mediaPublicUrl(p.media[0].bucket, p.media[0].path) : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium flex items-center gap-4"
              >
                <FileText className="shrink-0 text-cyan-600" />
                <div>
                  <h3 className="font-display text-base font-semibold text-nuit-950">{p.titre}</h3>
                  <p className="text-sm text-nuit-600">{p.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="bg-brume-100 py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-nuit-950">
              <ImageIcon size={22} className="text-cyan-600" /> Galerie
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.length === 0 && <EtatVide texte="Aucune image publiée pour cette série pour le moment." />}
            {images.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl bg-nuit-900/5">
                {img.media?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPublicUrl(img.media[0].bucket, img.media[0].path)}
                    alt={img.titre}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités liées */}
      {actus.length > 0 && (
        <section className="border-t border-nuit-900/5 bg-white py-20">
          <div className="container-isset">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-nuit-950">
                Actualités de la série
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {actus.map((a) => (
                <div key={a.id} className="card-premium">
                  <h3 className="font-display text-base font-semibold text-nuit-950">{a.titre}</h3>
                  <p className="mt-2 text-sm text-nuit-600">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-nuit-950 py-20 text-center text-white">
        <div className="container-isset">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">Je souhaite intégrer ISSET</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Rejoignez la série {serie.code} — {serie.nom} à la rentrée prochaine.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/admission" className="btn-primary">
                Voir les conditions d'admission
              </Link>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Écrire sur WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function EtatVide({ texte }: { texte: string }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-nuit-900/15 p-10 text-center text-sm text-nuit-500">
      {texte}
    </div>
  );
}