import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isset-togo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ISSET — Institutions Scientifiques Supérieures et d'Enseignement Technique | Lomé, Togo",
    template: "%s | ISSET Togo",
  },
  description:
    "ISSET, lycée technique à Lomé, Togo — filières économique (secrétariat, comptabilité, commerce & marketing) et industrielle (électronique, électrotechnique, génie civil). Former aujourd'hui les compétences techniques et professionnelles de demain.",
  keywords: [
    "ISSET Togo",
    "lycée technique Togo",
    "formation technique Lomé",
    "électronique Togo",
    "électrotechnique Togo",
    "génie civil Togo",
    "comptabilité Togo",
    "secrétariat bureautique Lomé",
    "commerce marketing Togo",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "ISSET",
    title: "ISSET — Institutions Scientifiques Supérieures et d'Enseignement Technique",
    description:
      "Établissement d'enseignement secondaire technique à Lomé, Togo. Filières économique et industrielle.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "ISSET Togo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISSET — Lomé, Togo",
    description: "Former aujourd'hui les compétences techniques et professionnelles de demain.",
    images: ["/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
