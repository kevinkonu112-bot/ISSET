"use client";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22899107362";
const MESSAGE =
  "Bonjour ISSET, je souhaite obtenir des informations concernant votre établissement et vos filières.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter ISSET sur WhatsApp"
      className="group fixed bottom-6 right-5 z-50 flex items-center gap-3 sm:bottom-8 sm:right-8"
    >
      <span className="hidden rounded-full bg-nuit-950 px-4 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 sm:block">
        Écrivez-nous sur WhatsApp
      </span>
      <span className="relative flex h-14 w-14 animate-float items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.5)] transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <svg
          viewBox="0 0 32 32"
          className="relative h-7 w-7 fill-white"
          aria-hidden="true"
        >
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.362.687 4.564 1.872 6.417L4 29l7.79-1.84A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3Zm6.965 17.06c-.29.816-1.44 1.53-2.35 1.72-.62.13-1.42.24-4.13-.89-3.46-1.43-5.69-4.92-5.86-5.15-.17-.23-1.41-1.87-1.41-3.57 0-1.7.89-2.53 1.2-2.88.31-.35.68-.44.9-.44.23 0 .45 0 .65.01.21.01.49-.08.76.58.29.68.98 2.39 1.06 2.56.08.17.14.38.03.61-.11.23-.17.38-.34.58-.17.2-.36.45-.51.6-.17.17-.35.35-.15.7.2.35.9 1.49 1.94 2.42 1.33 1.2 2.45 1.57 2.8 1.75.35.17.55.14.75-.08.2-.23.86-1 1.09-1.35.23-.35.46-.29.77-.17.31.11 1.98.94 2.32 1.11.34.17.56.26.64.4.09.15.09.85-.2 1.66Z" />
        </svg>
      </span>
    </a>
  );
}
