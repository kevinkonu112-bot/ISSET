import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "À propos",
  description: "Histoire, mission, vision et valeurs de l'ISSET, établissement technique à Lomé, Togo.",
};

async function getParametres() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("parametres").select("cle, valeur");
    const map: Record<string, string> = {};
    data?.forEach((p) => (map[p.cle] = p.valeur || ""));
    return map;
  } catch {
    return {};
  }
}

export default async function AProposPage() {
  const params = await getParametres();
  const val = (cle: string) => params[cle] || "[À RENSEIGNER PAR L'ADMINISTRATEUR]";

  const blocs = [
    { titre: "Notre histoire", cle: "histoire" },
    { titre: "Notre mission", cle: "mission" },
    { titre: "Notre vision", cle: "vision" },
    { titre: "Nos valeurs", cle: "valeurs" },
  ];

  return (
    <section className="bg-brume-100 pb-24 pt-36 sm:pt-44">
      <div className="container-isset">
        <Reveal>
          <span className="section-label">01 — À propos d'ISSET</span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-nuit-950">
            Institutions Scientifiques Supérieures et d'Enseignement Technique
          </h1>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {blocs.map((b, i) => (
            <Reveal key={b.cle} delay={i * 80}>
              <div className="card-premium h-full">
                <h2 className="font-display text-lg font-semibold text-nuit-950">{b.titre}</h2>
                <p className="mt-3 leading-relaxed text-nuit-700">{val(b.cle)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-col gap-6 rounded-3xl bg-nuit-950 p-10 text-white sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm text-white/50">
              Photo
            </div>
            <div>
              <span className="section-label text-cyan-400">Mot du directeur</span>
              <p className="mt-2 leading-relaxed text-white/80">{val("mot_directeur")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
