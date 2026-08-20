"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "acces_refuse"
      ? "Votre compte n'a pas les droits nécessaires pour accéder à l'espace administrateur."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    // Authentification réelle : Supabase Auth vérifie le mot de passe
    // hashé côté serveur et émet une session sécurisée (cookies httpOnly
    // gérés par @supabase/ssr). Aucun identifiant n'est jamais comparé
    // en clair dans ce fichier.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (signInError) {
      setError("Identifiants incorrects. Veuillez réessayer.");
      return;
    }

    router.push(params.get("redirectTo") || "/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-nuit-950 px-5">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <ShieldCheck size={26} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-white">
          Espace administrateur ISSET
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Connexion réservée au personnel autorisé de l'établissement.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-white/80">
              Email
            </label>
            <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Mail size={16} className="text-white/40" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                placeholder="admin@isset.tg"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-white/80">
              Mot de passe
            </label>
            <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Lock size={16} className="text-white/40" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                placeholder="••••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
