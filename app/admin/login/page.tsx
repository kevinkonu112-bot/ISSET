"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  // Initialisation propre avec le client SSR navigateur de Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    console.log("--- TENTATIVE DE CONNEXION ---");
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Réponse Supabase Auth:", { data, authError });

      if (authError) {
        setError(authError.message || "Identifiants incorrects.");
        setLoading(false);
        return;
      }

      if (data?.session) {
        console.log("Connexion réussie ! Redirection en cours...");
        // Redirection forcée vers le dashboard
        window.location.href = "/admin/dashboard";
      } else {
        setError("Erreur : Aucune session n'a pu être ouverte.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Erreur critique catch:", err);
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nuit-950 px-4">
      <div className="max-w-md w-full bg-nuit-900 border border-nuit-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">ISSET ADMIN</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Connectez-vous à votre espace de gestion</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email administrateur</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-nuit-950 border border-nuit-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="admin@isset.tg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-nuit-950 border border-nuit-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="/admin/forgot-password" className="text-cyan-400 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}