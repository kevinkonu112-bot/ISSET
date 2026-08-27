"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1); // Étape 1: Demande d'email | Étape 2: Saisie du code OTP et nouveau mot de passe
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Étape 1 : Appel de notre API personnalisée (Nodemailer + Brevo) pour envoyer le code OTP
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'envoi du code.");
      }

      setMessage("Un code de vérification à 6 chiffres a été envoyé à votre e-mail via Brevo.");
      setStep(2); // Passage à l'étape de saisie du code
    } catch (err: any) {
      setError(err.message || "Impossible d'envoyer l'e-mail de récupération.");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Vérification du code OTP et définition du nouveau mot de passe via l'API sécurisée
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode, newPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la réinitialisation.");
      }

      setMessage("Mot de passe mis à jour avec succès ! Redirection vers la connexion...");
      setTimeout(() => {
        router.push("/admin");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la réinitialisation.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nuit-950 px-4">
      <div className="max-w-md w-full bg-nuit-900 border border-nuit-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Récupération</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          {step === 1 ? "Entrez votre e-mail pour recevoir le code" : "Entrez le code reçu et votre nouveau mot de passe"}
        </p>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 text-sm rounded-lg">{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email administrateur</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-nuit-950 border border-nuit-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="admin@isset.tg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Envoi en cours..." : "Recevoir le code de récupération"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Code OTP (reçu par email)</label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-2 bg-nuit-950 border border-nuit-800 rounded-lg text-white tracking-widest text-center text-lg focus:outline-none focus:border-cyan-500"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 bg-nuit-950 border border-nuit-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white cursor-pointer focus:outline-none"
                >
                  {showPassword ? (
                    // Icône œil barré (masquer)
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    // Icône œil ouvert (afficher)
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Vérification..." : "Valider et changer le mot de passe"}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link href="/admin" className="text-sm text-cyan-400 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}