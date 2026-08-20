import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { whatsappHref } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admission — Intégrer ISSET",
  description: "Conditions d'admission, documents nécessaires et étapes d'inscription à ISSET, Lomé.",
};

async function getConditions() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("parametres")
      .select("valeur")
      .eq("cle", "conditions_admission")
      .single();
    return data?.valeur || "[Informations à compléter par l'administration]";
  } catch {
    return "[Informations à compléter par l'administration]";
  }
}

export default async function AdmissionPage() {
  const conditions = await getConditions();

  const etapes = [
    "Retirer ou télécharger le dossier d'inscription",
    "Constituer le dossier avec les documents requis",
    "Déposer le dossier au secrétariat de l'établissement",
    "Passer l'entretien ou le test d'admission (selon la série)",
    "Confirmer l'inscription après validation",
  ];

  return (
    <section className="bg-brume-100 pb-24 pt-36 sm:pt-44">
      <div className="container-isset grid gap-14 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <span className="section-label">Intégrer ISSET</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-nuit-950">
            Comment devenir étudiant à ISSET ?
          </h1>

          <div className="mt-8 card-premium">
            <h2 className="font-display text-lg font-semibold text-nuit-950">
              Conditions d'admission
            </h2>
            <p className="mt-3 leading-relaxed text-nuit-700">{conditions}</p>
          </div>

          <div className="mt-6 card-premium">
            <h2 className="font-display text-lg font-semibold text-nuit-950">
              Documents nécessaires
            </h2>
            <p className="mt-3 leading-relaxed text-nuit-700">
              [Informations à compléter par l'administration]
            </p>
          </div>

          <div className="mt-6 card-premium">
            <h2 className="font-display text-lg font-semibold text-nuit-950">
              Étapes d'inscription
            </h2>
            <ol className="mt-4 space-y-4">
              {etapes.map((e, i) => (
                <li key={e} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-600">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-nuit-700">{e}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="sticky top-28 rounded-3xl bg-nuit-950 p-8 text-white">
            <h2 className="font-display text-xl font-bold">Besoin d'aide ?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Notre équipe répond directement à vos questions sur WhatsApp concernant
              l'admission et les filières.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {["Réponse rapide", "Conseils personnalisés", "Toutes les filières"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400" /> {t}
                </li>
              ))}
            </ul>
            <a
              href={whatsappHref(
                "Bonjour ISSET, je souhaite obtenir des informations concernant l'admission et l'inscription."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 w-full"
            >
              Demander des informations
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
