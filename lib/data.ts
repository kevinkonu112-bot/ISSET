// Ce fichier centralise la structure PÉDAGOGIQUE fixe d'ISSET
// (filières et séries). Elle sert de "fallback" si la base de
// données n'est pas encore configurée, et de référence pour le
// seed SQL (supabase/schema.sql). Les CONTENUS (cours, actus,
// vidéos, PDF...) sont eux entièrement gérés depuis /admin.

export type Serie = {
  code: string;
  slug: string;
  nom: string;
  filiereSlug: "economique" | "industrielle";
  resume: string;
  themes: string[];
};

export type Filiere = {
  slug: "economique" | "industrielle";
  nom: string;
  description: string;
};

export const FILIERES: Filiere[] = [
  {
    slug: "economique",
    nom: "Filière Économique",
    description:
      "Secrétariat bureautique, comptabilité, commerce et marketing : les métiers de la gestion et de l'administration des entreprises.",
  },
  {
    slug: "industrielle",
    nom: "Filière Industrielle",
    description:
      "Électronique, électrotechnique, génie civil : les métiers techniques qui construisent et font fonctionner le monde de demain.",
  },
];

export const SERIES: Serie[] = [
  {
    code: "G1",
    slug: "secretariat-bureautique",
    nom: "Secrétariat bureautique",
    filiereSlug: "economique",
    resume:
      "Informatique, outils bureautiques, traitement de texte, organisation administrative et communication professionnelle.",
    themes: [
      "Informatique",
      "Outils bureautiques",
      "Traitement de texte",
      "Organisation administrative",
      "Secrétariat",
      "Communication professionnelle",
      "Utilisation de l'ordinateur",
    ],
  },
  {
    code: "G2",
    slug: "comptabilite",
    nom: "Comptabilité",
    filiereSlug: "economique",
    resume:
      "Comptabilité, gestion, opérations comptables, marchés financiers, gestion et analyse financière.",
    themes: [
      "Comptabilité",
      "Gestion",
      "Opérations comptables",
      "Marchés financiers",
      "Gestion financière",
      "Analyse financière",
    ],
  },
  {
    code: "G3",
    slug: "commerce-marketing",
    nom: "Commerce & Marketing",
    filiereSlug: "economique",
    resume:
      "Techniques de vente, commercialisation, marketing, relation client, TVA et stratégie commerciale.",
    themes: [
      "Techniques de vente",
      "Commercialisation",
      "Marketing",
      "Relation client",
      "TVA",
      "Stratégie commerciale",
    ],
  },
  {
    code: "F2",
    slug: "electronique",
    nom: "Électronique",
    filiereSlug: "industrielle",
    resume:
      "Électronique, appareils numériques, circuits électroniques, programmation, numérisation et automatisation.",
    themes: [
      "Électronique",
      "Appareils numériques",
      "Circuits électroniques",
      "Programmation",
      "Numérisation",
      "Automatisation",
      "Technologies numériques",
    ],
  },
  {
    code: "F3",
    slug: "electrotechnique",
    nom: "Électrotechnique",
    filiereSlug: "industrielle",
    resume:
      "Électricité bâtiment, électricité industrielle, moteurs électriques, câblage et installations électrotechniques.",
    themes: [
      "Électricité bâtiment",
      "Électricité industrielle",
      "Moteurs électriques",
      "Branchement",
      "Câblage",
      "Installations électriques",
      "Systèmes électrotechniques",
    ],
  },
  {
    code: "F4",
    slug: "genie-civil",
    nom: "Génie civil",
    filiereSlug: "industrielle",
    resume:
      "Architecture, génie civil, plans, construction, planimétrie, géométrie, topométrie et conception de bâtiments.",
    themes: [
      "Architecture",
      "Génie civil",
      "Plans",
      "Construction",
      "Projets",
      "Planimétrie",
      "Géométrie",
      "Topométrie",
      "Géographie appliquée",
      "Conception de bâtiments",
    ],
  },
];

export function getSeriesByFiliere(filiereSlug: string) {
  return SERIES.filter((s) => s.filiereSlug === filiereSlug);
}

export function getSerie(slug: string) {
  return SERIES.find((s) => s.slug === slug);
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22899107362";
export const WHATSAPP_MESSAGE =
  "Bonjour ISSET, je souhaite obtenir des informations concernant votre établissement et vos filières.";

export function whatsappHref(customMessage?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    customMessage || WHATSAPP_MESSAGE
  )}`;
}
