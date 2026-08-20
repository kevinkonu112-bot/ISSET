/**
 * Crée le compte administrateur initial d'ISSET.
 *
 * Usage :
 *   1. Copier .env.example en .env.local et renseigner les clés Supabase
 *      (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 *   2. Exécuter : npm run create-admin
 *
 * Le script génère un nom d'utilisateur (email) et un mot de passe
 * temporaire robustes, crée l'utilisateur via l'API Admin de Supabase
 * (le mot de passe est haché par Supabase — jamais stocké en clair),
 * puis affiche les identifiants UNE SEULE FOIS dans le terminal.
 *
 * IMPORTANT : notez ces identifiants immédiatement et changez le mot
 * de passe après la première connexion. Ils ne sont jamais écrits
 * dans le code source ni commités dans Git.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local"
  );
  process.exit(1);
}

function generatePassword(length = 16) {
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((n) => charset[n % charset.length])
    .join("");
}

async function main() {
  const admin = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = `admin@isset-togo.local`;
  const password = generatePassword(16);

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("❌ Erreur lors de la création du compte :", error.message);
    process.exit(1);
  }

  // upsert (et non insert) : si la migration 002 est en place, un
  // trigger crée déjà une ligne "profiles" avec role='editeur' par
  // défaut dès la création du compte auth.users. On la fait ici
  // basculer explicitement sur 'admin'. Le service_role contourne
  // le RLS, donc cette opération fonctionne quel que soit l'état
  // des policies.
  const { error: profileError } = await admin.from("profiles").upsert(
    { id: data.user!.id, full_name: "Administrateur ISSET", role: "admin" },
    { onConflict: "id" }
  );

  if (profileError) {
    console.error(
      "❌ Compte auth créé mais échec de l'attribution du rôle admin :",
      profileError.message
    );
    process.exit(1);
  }

  console.log("\n=========================================");
  console.log(" ✅ COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS ");
  console.log("=========================================\n");
  console.log("ADMIN USERNAME (email) :", email);
  console.log("TEMPORARY PASSWORD     :", password);
  console.log("\nURL de connexion : /admin/login");
  console.log(
    "\n⚠️  Copiez ces identifiants maintenant : ils ne seront plus jamais affichés."
  );
  console.log("⚠️  Changez le mot de passe après la première connexion.\n");
}

main();
