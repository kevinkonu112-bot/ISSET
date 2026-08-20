import IssetLogo from "@/components/IssetLogo";
import Link from "next/link";
import { ArrowRight, GraduationCap, Cpu, Wrench, Building2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { FILIERES, SERIES, whatsappHref } from "@/lib/data";
import { getActualites, mediaPublicUrl } from "@/lib/contents";

export default async function HomePage() {
  const actualites = await getActualites(3);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-nuit-950 text-white">
        <div className="absolute inset-0 bg-grid-glow" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(rgba(18,181,214,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(18,181,214,0.15) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          }}
        />
        <div className="container-isset relative z-10 pt-28 pb-20">
          <Reveal>
            <span className="section-label text-cyan-400">
              Établissement d'enseignement secondaire technique — Lomé, Togo
            </span>
          </Reveal>

          {/* Le Logo Animé Pro remplace l'ancien texte */}
          <Reveal delay={100}>
            <div className="mt-6">
              <IssetLogo />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 mx-auto text-center sm:mx-0 sm:text-left">
              Former aujourd'hui les compétences techniques et professionnelles de demain.
              Deux filières, six séries, une même exigence d'excellence.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center sm:justify-start">
              <Link href="/filieres" className="btn-primary">
                Découvrir nos filières <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Nous contacter
              </Link>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Écrire sur WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-20 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
              {[
                { label: "Filières", value: "2" },
                { label: "Séries", value: "6" },
                { label: "Domaines", value: "Éco. & Industriel" },
                { label: "Localisation", value: "Lomé, Togo" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-cyan-400 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 01 — À PROPOS ============ */}
      <section className="bg-brume-100 py-24 sm:py-32">
        <div className="container-isset grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <span className="section-label">01 — À propos d'ISSET</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-nuit-950 sm:text-4xl">
              Un établissement tourné vers la science, la technique et l'avenir.
            </h2>
            <p className="mt-6 leading-relaxed text-nuit-700">
              [À RENSEIGNER PAR L'ADMINISTRATEUR] — présentation générale de l'établissement,
              de son histoire et de son ancrage à Lomé.
            </p>
            <Link href="/a-propos" className="btn-outline-dark mt-8">
              En savoir plus <ArrowRight size={16} />
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
                <div key={item.title} className="card-premium">
                  <h3 className="font-display text-base font-semibold text-nuit-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-nuit-700">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ACTUALITÉS & ÉVÉNEMENTS ============ */}
      <section className="bg-nuit-950 py-24 text-white sm:py-32 border-t border-white/10">
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
                  Aucune actualité publiée pour le moment. Les prochaines actualités
                  publiées depuis l'espace administrateur apparaîtront ici.
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

      {/* ============ 02 — NOS FILIÈRES ============ */}
      <section className="bg-nuit-950 py-24 text-white sm:py-32 border-t border-white/10">
        <div className="container-isset">
          <Reveal>
            <span className="section-label text-cyan-400">02 — Nos filières</span>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Deux filières, six voies d'excellence.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {FILIERES.map((filiere, idx) => {
              const bgImage = filiere.slug === "economique" 
                ? "/images/filieres/economique.png" 
                : "/images/filieres/industrielle.png";

              return (
                <Reveal key={filiere.slug} delay={idx * 150}>
                  <Link
                    href={`/filieres#${filiere.slug}`}
                    className="group relative block overflow-hidden rounded-3xl border border-white/10 p-10 transition-all duration-500 hover:border-cyan-400/40"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                    
                    <div className="absolute inset-0 bg-nuit-950/85 transition-colors duration-500 group-hover:bg-nuit-950/75" />

                    <div className="relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
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
                      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400">
                        Explorer la filière
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ ADMISSION CTA ============ */}
      <section className="relative overflow-hidden bg-nuit-950 py-24 text-white sm:py-28 border-t border-white/10">
        <div className="absolute inset-0 bg-grid-glow" />
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
    </>
  );
}