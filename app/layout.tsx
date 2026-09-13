import type { Metadata, Viewport } from "next";
import { bezszeryfowy, odreczny } from "@/lib/ui/fonty";
import "./globals.css";

export const metadata: Metadata = {
  title: "DreamWork",
  description: "Program warsztatów rozwojowo-zawodowych 16–24",
  // Raport uczestnika zawiera wizję życia, zdrowie i sytuację finansową.
  // Nic z tego nie ma prawa trafić do wyszukiwarki ani do jej pamięci.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f6fb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${bezszeryfowy.variable} ${odreczny.variable}`}>
      <body className="min-h-dvh bg-tlo font-sans text-atrament antialiased">
        <a href="#tresc" className="przeskocz">
          Przejdź do treści
        </a>
        <div id="tresc">{children}</div>
      </body>
    </html>
  );
}
