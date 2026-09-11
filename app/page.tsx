import Link from "next/link";
import { WejscieKodem } from "@/components/WejscieKodem";
import { Bramy } from "@/components/pulpit/Bramy";
import { Znak } from "@/components/pulpit/Znak";

export const metadata = { title: "Moja mapa kierunku" };

/**
 * Wejście do programu. Bez rejestracji, bez hasła, bez konta — tylko kod,
 * który uczestnik dostaje od prowadzącego.
 */
export default function Strona() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[78rem] items-center px-5 py-10 sm:px-8">
      <div className="szklo relative w-full overflow-hidden p-8 sm:p-12 lg:p-14">
        <Bramy klasa="pointer-events-none absolute -right-10 bottom-0 hidden h-[22rem] w-[32rem] opacity-80 lg:block" />

        <div className="relative max-w-[34rem]">
          <div className="flex items-center gap-3">
            <Znak rozmiar={44} />
            <span>
              <span className="block text-tresc-duza font-extrabold tracking-tight">Kierunek</span>
              <span className="block text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
                Fundacja Służąc Życiu
              </span>
            </span>
          </div>

          <h1 className="mt-9 text-tytul font-extrabold leading-[1.03] tracking-tight">
            Trzy drogi.
            <br />
            <span className="gradient-tytul">Wiele możliwości.</span>
          </h1>

          <p className="proza mt-5">
            Program warsztatów rozwojowo&#8209;zawodowych dla osób 16–24. Cztery spotkania
            grupowe i jedna rozmowa indywidualna. Bez zgadywania, kim chcesz być.
          </p>

          <div className="mt-9">
            <WejscieKodem />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-drobne text-atrament-slaby">
            <span className="inline-flex items-center gap-2">
              <Klodka /> Dostęp tylko z kodem od prowadzącego
            </span>
            <span className="inline-flex items-center gap-2">
              Prowadzący?{" "}
              <Link
                href="/prowadzacy"
                className="przejscie underline underline-offset-4 hover:text-akcent-jasny"
              >
                wejście do panelu
              </Link>
            </span>
          </div>
        </div>

        <p className="odreczny absolute bottom-10 right-12 hidden text-right xl:block">
          Trzy drogi.
          <br />
          Twój kierunek.
        </p>
      </div>
    </main>
  );
}

function Klodka() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}
