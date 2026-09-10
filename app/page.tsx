import Link from "next/link";
import { WejscieKodem } from "@/components/WejscieKodem";

export const metadata = { title: "Moja mapa kierunku" };

export default function Strona() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
      <p className="text-drobne uppercase tracking-[0.1em] text-atrament-slaby">
        Fundacja Służąc Życiu
      </p>
      <h1 className="mt-3 font-serif text-naglowek-duzy leading-tight">Moja mapa kierunku</h1>
      <p className="proza mt-4 text-atrament-sciszony">
        Program warsztatów rozwojowo&#8209;zawodowych. Wpisz kod, który dostałeś od prowadzącego.
      </p>

      <div className="mt-10">
        <WejscieKodem />
      </div>

      <p className="mt-16 text-drobne text-atrament-slaby">
        Prowadzący?{" "}
        <Link href="/prowadzacy" className="underline underline-offset-2 hover:text-atrament">
          Wejście do panelu
        </Link>
      </p>
    </main>
  );
}
