import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moja mapa kierunku",
  description: "Program warsztatów rozwojowo-zawodowych 16–24",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
