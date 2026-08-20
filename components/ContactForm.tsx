"use client";

import { useState } from "react";
import { whatsappHref } from "@/lib/data";

export default function ContactForm() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texte = `Bonjour ISSET, je m'appelle ${nom || "—"} (tél. ${
      telephone || "—"
    }). ${message || "Je souhaite obtenir des informations sur l'établissement."}`;
    window.open(whatsappHref(texte), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="nom" className="text-sm font-medium text-nuit-800">
          Nom complet
        </label>
        <input
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-nuit-900/10 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          placeholder="Votre nom"
        />
      </div>
      <div>
        <label htmlFor="telephone" className="text-sm font-medium text-nuit-800">
          Téléphone
        </label>
        <input
          id="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-nuit-900/10 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          placeholder="+228 ..."
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-nuit-800">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-nuit-900/10 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          placeholder="Votre message..."
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Envoyer via WhatsApp
      </button>
      <p className="text-center text-xs text-nuit-400">
        Le message s'ouvre directement dans WhatsApp, prêt à être envoyé.
      </p>
    </form>
  );
}
