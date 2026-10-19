import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Film, ImageIcon, CheckCircle2, ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SERIES, whatsappHref } from "@/lib/data";
import { getPublishedContents, mediaPublicUrl } from "@/lib/contents";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ filiere: string; serie: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const serieStatic = SERIES.find((s) => s.slug === resolvedParams.serie);
  if (!serieStatic) return {};
  return {
    title: `${serieStatic.code} — ${serieStatic.nom}`,
    description: serieStatic.resume,
  };
}

export default async function SeriePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { filiere, serie: serieSlug } = resolvedParams;

  const serieStatic = SERIES.find((s) => s.slug === serieSlug && s.filiereSlug === filiere);
  if (!serieStatic) notFound();

  // Connexion à Supabase côté serveur pour récupérer la présentation et les objectifs saisis dans l'admin
  const supabase = createClient();
  const { data: dbSerie, error: dbError } = await supabase
    .from("series")
    .select("*")
    .ilike("code", serieStatic.code)
    .maybeSingle();

  // Affichage de contrôle dans le terminal (serveur)
  console.log("=== INSPECTION SUPABASE SERIE ===");
  console.log("Code recherché :", serieStatic.code);
  console.log("Résultat brut Supabase (dbSerie) :", dbSerie);
  console.log("Erreur éventuelle Supabase :", dbError);
  console.log("=================================");

  const presentation = dbSerie?.description || "Présentation détaillée à renseigner depuis le dashboard admin.";
  const objectifs = dbSerie?.objectifs || "Objectifs pédagogiques à renseigner depuis le dashboard admin.";

  const serieImageBg = `/images/series/${serieStatic.code.toLowerCase()}.png`;

  const contenus = await getPublishedContents({ serieSlug: serieStatic.slug });
  const cours = contenus.filter((c) => c.type === "cours");
  const videos = contenus.filter((c) => c.type === "video");
  const pdfs = contenus.filter((c) => c.type === "pdf");
  const images = contenus.filter((c) => c.type === "image");
  const actus = contenus.filter((c) => c.type === "evenement" || c.type === "annonce");

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-nuit-950 text-white pt-32 pb-20 sm:pt-40">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${serieImageBg})` }} />
        <div className="absolute inset-0 bg-nuit-950/85" />

        <div className="container-isset relative z-10">
          <Reveal>
            <Link href={`/filieres#${serieStatic.filiereSlug}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-6 hover:underline">
              <ArrowLeft size={14} /> Retour à la filière
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-4">
              {serieStatic.filiereSlug === "economique" ? "Filière économique" : "Filière industrielle"}
            </span>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {serieStatic.code} — {serieStatic.nom}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              {serieStatic.resume}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Présentation & Objectifs dynamiques */}
      <section className="bg-brume-100 py-20">
        <div className="container-isset grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-slate-900">Présentation</h2>
            <p className="mt-4 leading-relaxed text-slate-700 whitespace-pre-line">
              {presentation}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-display text-2xl font-bold text-slate-900">Objectifs de la série</h2>
            <p className="mt-4 leading-relaxed text-slate-700 whitespace-pre-line">
              {objectifs}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Compétences développées */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="container-isset">
          <Reveal>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-6">
              Compétences développées
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serieStatic.themes.map((t) => (
                <div key={t} className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-600" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cours disponibles */}
      <section className="border-t border-slate-200 bg-brume-100 py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-slate-900">Cours disponibles</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cours.length === 0 && <EtatVide texte="Aucun cours publié pour cette série pour le moment." />}
            {cours.map((c) => (
              <div key={c.id} className="card-premium bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-display text-base font-semibold text-slate-900">{c.titre}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vidéos pédagogiques */}
      <section className="bg-white py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900">
              <Film size={22} className="text-cyan-600" /> Vidéos pédagogiques
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.length === 0 && <EtatVide texte="Aucune vidéo publiée pour cette série pour le moment." />}
            {videos.map((v) => (
              <div key={v.id} className="card-premium bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-display text-base font-semibold text-slate-900">{v.titre}</h3>
                {v.media?.[0] && (
                  <video
                    controls
                    preload="none"
                    className="mt-3 aspect-video w-full rounded-lg bg-slate-950"
                    src={mediaPublicUrl(v.media[0].bucket, v.media[0].path)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents PDF */}
      <section className="border-t border-slate-200 bg-brume-100 py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900">
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
                className="card-premium flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-cyan-500 transition-all"
              >
                <FileText className="shrink-0 text-cyan-600" size={24} />
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-900">{p.titre}</h3>
                  <p className="text-sm text-slate-600">{p.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="bg-white py-20">
        <div className="container-isset">
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-slate-900">
              <ImageIcon size={22} className="text-cyan-600" /> Galerie
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.length === 0 && <EtatVide texte="Aucune image publiée pour cette série pour le moment." />}
            {images.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
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

      {/* CTA */}
      <section className="bg-nuit-950 py-20 text-center text-white">
        <div className="container-isset">
          <Reveal>
            <h2 className="font-display text-3xl font-bold">Je souhaite intégrer ISSET</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Rejoignez la série {serieStatic.code} — {serieStatic.nom} à la rentrée prochaine.
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
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 bg-white">
      {texte}
    </div>
  );
}