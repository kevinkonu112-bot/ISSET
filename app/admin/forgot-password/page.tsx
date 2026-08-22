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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Étape 1 : Envoyer le code OTP par e-mail
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Utilisation de la méthode de récupération par OTP de Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      setError("Erreur lors de l'envoi du code. Vérifiez votre e-mail ou la configuration Supabase.");
      setLoading(false);
    } else {
      setMessage("Un code de vérification à 6 chiffres a été envoyé à votre e-mail.");
      setStep(2); // Passage à l'étape de saisie du code
      setLoading(false);
    }
  };

  // Étape 2 : Vérifier le code OTP et définir le nouveau mot de passe
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Vérification du code OTP
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'recovery',
    });

    if (verifyError) {
      setError("Code invalide ou expiré.");
      setLoading(false);
      return;
    }

    // 2. Mise à jour avec le nouveau mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setMessage("Mot de passe mis à jour avec succès ! Redirection...");
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
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
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
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
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-nuit-950 border border-nuit-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
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