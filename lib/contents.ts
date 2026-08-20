import { createClient } from "@/lib/supabase/server";

export type Content = {
  id: string;
  titre: string;
  slug: string;
  description: string | null;
  corps: string | null;
  type: "video" | "pdf" | "image" | "texte" | "annonce" | "cours" | "activite" | "evenement";
  statut: "brouillon" | "publie" | "archive";
  filiere_id: string | null;
  serie_id: string | null;
  category_id: string | null;
  date_publication: string | null;
  created_at: string;
  media?: { id: string; path: string; type: string; bucket: string }[];
};

// Tant que Supabase n'est pas configuré (variables d'environnement
// absentes), le site public continue de fonctionner.
function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getPublishedContents(filters?: {
  serieSlug?: string;
  categorieSlug?: string;
  type?: string;
  limit?: number;
}): Promise<Content[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createClient();
  let query = supabase
    .from("contents")
    .select("*, media(id, path, type, bucket), series!inner(slug), categories(slug)")
    .eq("statut", "publie")
    .order("date_publication", { ascending: false });

  if (filters?.serieSlug) query = query.eq("series.slug", filters.serieSlug);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("Erreur récupération contenus :", error.message);
    return [];
  }
  return (data as unknown as Content[]) || [];
}

export async function getActualites(limit = 12) {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("contents")
    .select("*, media(id, path, type, bucket)")
    .eq("statut", "publie")
    .in("type", ["evenement", "annonce"])
    .order("date_publication", { ascending: false })
    .limit(limit);
  return (data as unknown as Content[]) || [];
}

export async function getGalerieMedia(limit = 24) {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  
  const { data } = await supabase
    .from("media")
    .select("id, path, type, bucket, content_id, contents!inner(statut, titre, description, type)")
    .eq("contents.statut", "publie")
    .not("contents.type", "in", '("evenement","annonce")')
    .order("created_at", { ascending: false })
    .limit(limit);

  const allowedExtensions = [
    ".jpg", ".jpeg", ".png", ".webp", ".avif", // Images
    ".mp4", ".mov", ".webm", ".ogg",          // Vidéos
    ".pdf"                                    // Documents PDF
  ];

  const cleanData = (data || []).filter((item: any) => {
    if (!item.path) return false;
    const pathLower = item.path.toLowerCase();
    return allowedExtensions.some((ext) => pathLower.endsWith(ext));
  });

  return cleanData;
}

export function mediaPublicUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}