import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez ISSET à Lomé, Togo : WhatsApp, adresse, email et horaires.",
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

export default async function ContactPage() {
  const params = await getParametres();
  const val = (cle: string) => params[cle] || "[À RENSEIGNER PAR L'ADMINISTRATEUR]";

  const infos = [
    { icon: MapPin, label: "Adresse", value: val("adresse") },
    { icon: Phone, label: "WhatsApp", value: "+228 99 10 73 62" },
    { icon: Mail, label: "Email", value: val("email") },
    { icon: Clock, label: "Horaires", value: val("horaires") },
  ];

  return (
    <section className="bg-brume-100 pb-24 pt-36 sm:pt-44">
      <div className="container-isset grid gap-14 lg:grid-cols-2">
        <Reveal>
          <span className="section-label">Contactez ISSET</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-nuit-950">
            Une question ? Parlons-en.
          </h1>
          <p className="mt-4 max-w-md text-nuit-600">
            Notre équipe vous répond rapidement, sur WhatsApp ou via le formulaire
            ci-contre.
          </p>

          <div className="mt-10 space-y-5">
            {infos.map((info) => (
              <div key={info.label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                  <info.icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-nuit-400">
                    {info.label}
                  </p>
                  <p className="mt-1 text-nuit-800">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="card-premium">
            <h2 className="font-display text-lg font-semibold text-nuit-950">
              Envoyer un message
            </h2>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
