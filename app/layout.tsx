import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesa de Ayuda | Bloque La Libertad Avanza Avellaneda",
  description:
    "Plataforma oficial de reclamos vecinales del Bloque La Libertad Avanza Avellaneda. Reportá problemas en tu barrio y seguí el estado de tu reclamo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
