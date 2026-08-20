import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-nuit-950 text-white/70">
      <div className="container-isset grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-nuit-700 font-display text-lg font-bold text-white">
              I
            </span>
            <span className="font-display text-lg font-bold text-white">ISSET</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Institutions Scientifiques Supérieures et d'Enseignement Technique — Lomé, Togo.
            Former aujourd'hui les compétences techniques et professionnelles de demain.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Navigation
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/a-propos" className="hover:text-cyan-400">À propos</Link></li>
            <li><Link href="/filieres" className="hover:text-cyan-400">Filières</Link></li>
            <li><Link href="/actualites" className="hover:text-cyan-400">Actualités</Link></li>
            <li><Link href="/admission" className="hover:text-cyan-400">Admission</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>Lomé — Togo</li>
            <li>
              <a
                href="https://wa.me/22899107362"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400"
              >
                WhatsApp : +228 99 10 73 62
              </a>
            </li>
            <li><Link href="/contact" className="hover:text-cyan-400">Formulaire de contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-isset flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© 2026 ISSET — Tous droits réservés.</p>
          <p>Site web conçu et développé par [À RENSEIGNER]</p>
        </div>
      </div>
    </footer>
  );
}
