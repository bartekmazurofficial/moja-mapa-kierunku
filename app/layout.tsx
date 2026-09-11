import type { Metadata, Viewport } from "next";
import { bezszeryfowy, szeryfowy } from "@/lib/ui/fonty";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moja mapa kierunku",
  description: "Program warsztatów rozwojowo-zawodowych 16–24",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${bezszeryfowy.variable} ${szeryfowy.variable}`}>
      <body className="min-h-dvh bg-tlo font-sans text-atrament antialiased">
        <a href="#tresc" className="przeskocz">
          Przejdź do treści
        </a>
        <div id="tresc">{children}</div>
      </body>
    </html>
  );
}
