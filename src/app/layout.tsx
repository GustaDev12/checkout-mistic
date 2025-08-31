import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🔥 Jade Maria - Conteúdos Exclusivos",
  description: "Acesse agora fotos e vídeos íntimos, conteúdos exclusivos e segredos proibidos de Jade Maria. Liberado imediatamente após a compra. 😈",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} ${inter.variable} antialiased  `}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
