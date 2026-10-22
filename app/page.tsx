import IssetLogo from "@/components/IssetLogo";
import Link from "next/link";
import { ArrowRight, GraduationCap, Cpu, Building2, Wrench, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { FILIERES, SERIES, whatsappHref } from "@/lib/data";
import { getActualites, mediaPublicUrl } from "@/lib/contents";

export default async function HomePage() {
  const actualites = await getActualites(3);

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative bg-[#030712] text-white min-h-[85vh] sm:min-h-screen flex flex-col justify-between pt-36 sm:pt-44 pb-8 sm:py-16 overflow-hidden">
        {/* Image de fond et effet de grille subtil */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
              backgroundSize: '4rem 4rem',
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)'
            }}
          />
          <img
            src="/batiment_isset.jpg"
            alt="Bâtiment de l'ISSET à Tsévié"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-[#030712]/40 to-[#030712]/95" />
        </div>

        {/* Contenu principal du Hero */}
        <div className="container-isset relative z-10 text-center sm:text-left my-auto">
          <Reveal>
            <span className="inline-flex items-center gap-2 section-label text-cyan-400 bg-[#030712]/90 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-500/10 text-[11px] sm:text-sm">
              <Sparkles size={14} className="text-cyan-400" />
              Établissement d'enseignement secondaire technique — Tsévié, Togo
            </span>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-4 flex justify-center sm:justify-start scale-95 sm:scale-100 origin-left drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <IssetLogo />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-sm sm:text-lg leading-relaxed text-white/95 font-medium mx-auto sm:mx-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Former aujourd'hui les compétences techniques et professionnelles de demain.
              Science, technologie et innovation au service de l'excellence.
            </p>
          </Reveal>
        </div>

        {/* Statistiques */}
        <div className="container-isset relative z-10 mt-6 sm:mt-8">
          <Reveal delay={300}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 bg-[#030712]/95 border border-cyan-500/30 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl shadow-2xl">
              {[
                { label: "Filières", value: "2" },
                { label: "Séries", value: "6" },
                { label: "Domaines", value: "Éco. & Industriel" },
                { label: "Localisation", value: "Tsévié, Togo" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="font-display text-lg sm:text-3xl font-extrabold text-cyan-400 drop-shadow-md">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-white/90 font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 01 — NOS FILIÈRES ============ */}
      <section className="bg-[#030712] py-20 text-white sm:py-32 border-t border-cyan-500/10 relative overflow-hidden">
        <div className="container-isset relative z-10">
          <Reveal>
            <span className="section-label text-cyan-400">01 — Nos filières</span>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Deux filières, six voies d'excellence.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {FILIERES.map((filiere, idx) => {
              const recBgImage = filiere.slug === "economique" 
                ? "/images/filieres/economique.png" 
                : "/images/filieres/industrielle.png";

              return (
                <Reveal key={filiere.slug} delay={idx * 150}>
                  <div className="group relative block overflow-hidden rounded-3xl border border-white/10 p-10 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 bg-slate-900/50">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-35"
                      style={{ backgroundImage: `url(${recBgImage})` }}
                    />
                    <div className="absolute inset-0 bg-[#030712]/85 transition-colors duration-500 group-hover:bg-[#030712]/75" />

                    <div className="relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        {filiere.slug === "economique" ? (
                          <GraduationCap size={26} />
                        ) : (
                          <Cpu size={26} />
                        )}
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-bold">{filiere.nom}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/80">
                        {filiere.description}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {SERIES.filter((s) => s.filiereSlug === filiere.slug).map((s) => (
                          <li
                            key={s.code}
                            className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
                          >
                            {s.code} — {s.nom}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-8">
                        <Link
                          href={`/filieres/${filiere.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Explorer la filière
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 02 — À PROPOS ============ */}
      <section className="bg-slate-100 py-20 sm:py-32">
        <div className="container-isset grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="section-label">02 — À propos d'ISSET</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Un établissement tourné vers la science, la technique et l'avenir à Tsévié.
            </h2>
            <p className="mt-6 leading-relaxed text-slate-700">
              [À RENSEIGNER PAR L'ADMINISTRATEUR] — présentation générale de l'établissement,
              de son histoire et de son ancrage à Tsévié.
            </p>
            <Link href="/a-propos" className="btn-outline-dark mt-8 inline-flex items-center">
              En savoir plus <ArrowRight size={16} className="ml-2" />
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { title: "Mission", text: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
                { title: "Vision", text: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
                { title: "Valeurs", text: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
                { title: "Mot du directeur", text: "[À RENSEIGNER PAR L'ADMINISTRATEUR]" },
              ].map((item) => (
                <div key={item.title} className="card-premium bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-display text-base font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ACTUALITÉS & ÉVÉNEMENTS ============ */}
      <section className="bg-[#030712] py-20 text-white sm:py-32 border-t border-white/10">
        <div className="container-isset">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="section-label text-cyan-400">Actualités & événements</span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  La vie à ISSET
                </h2>
              </div>
              <Link href="/actualites" className="btn-secondary">
                Toutes les actualités <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {actualites.length === 0 && (
              <Reveal className="col-span-full">
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center text-white/50 backdrop-blur-sm">
                  Aucune actualité publiée pour le moment.
                </div>
              </Reveal>
            )}
            {actualites.map((a, idx) => {
              const firstMedia = a.media && a.media.length > 0 ? a.media[0] : null;
              const mediaUrl = firstMedia ? mediaPublicUrl(firstMedia.bucket, firstMedia.path) : null;
              
              const isVideo = firstMedia?.type === "video" || (mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov") || mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".ogg")));
              const isPdf = firstMedia?.type === "pdf" || (mediaUrl && mediaUrl.toLowerCase().endsWith(".pdf"));

              const rawDate = a.date_publication || a.created_at;
              const formattedDate = rawDate
                ? new Date(rawDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).toUpperCase()
                : null;

              return (
                <Reveal key={a.id || idx} delay={idx * 100}>
                  <article className="h-full flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:border-cyan-400/40 hover:bg-white/[0.06]">
                    {mediaUrl ? (
                      <div className="mb-6 h-56 w-full overflow-hidden rounded-2xl bg-black/40 flex items-center justify-center relative group">
                        {isVideo ? (
                          <video 
                            src={mediaUrl} 
                            controls 
                            playsInline 
                            preload="auto"
                            className="h-full w-full object-contain bg-black rounded-xl"
                          >
                            Votre navigateur ne supporte pas la lecture de vidéos.
                          </video>
                        ) : isPdf ? (
                          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                            <span className="text-cyan-400 font-semibold text-sm">📄 Document PDF</span>
                            <a href={mediaUrl} target="_blank" rel="noopener noreferrer" 
                               className="px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-xs text-white">
                              Ouvrir le document
                            </a>
                          </div>
                        ) : (
                          <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full cursor-zoom-in">
                            <img 
                              src={mediaUrl} 
                              alt={a.titre}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="mb-6 h-48 w-full rounded-2xl bg-white/5 flex items-center justify-center text-white/30 text-xs italic">
                        Aucun média
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="section-label text-cyan-400 m-0">
                        {a.type === "annonce" ? "Annonce" : "Événement"}
                      </span>
                      {formattedDate && (
                        <span className="text-xs text-white/50 font-medium">{formattedDate}</span>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-semibold text-white">
                      {a.titre}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed italic text-white/70 font-serif">
                      {a.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ADMISSION CTA ============ */}
      <section className="relative overflow-hidden bg-[#030712] py-20 text-white sm:py-28 border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="container-isset relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <div className="flex items-center gap-3 text-cyan-400">
              <Building2 size={22} />
              <Wrench size={22} />
            </div>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à intégrer ISSET ?
            </h2>
            <p className="mt-4 max-w-lg text-white/70">
              Découvrez les conditions d'admission et les étapes pour rejoindre l'une de
              nos six séries.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/admission" className="btn-primary">
                Intégrer ISSET <ArrowRight size={16} />
              </Link>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Demander des informations
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}