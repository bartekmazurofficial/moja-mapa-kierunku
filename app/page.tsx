import Link from "next/link";
import { Bramy } from "@/components/pulpit/Bramy";
import { Znak } from "@/components/pulpit/Znak";
import { prisma } from "@/lib/db/klient";
import { trybTestowy } from "@/lib/tryb";

export const dynamic = "force-dynamic";
export const metadata = { title: "DreamWork" };

/**
 * W trybie testowym kafel uczestnika prowadzi prosto na pulpit pierwszej osoby
 * z listy, zeby nie trzeba bylo wybierac konta ani wpisywac kodu.
 */
async function wejscieUczestnika(): Promise<{ href: string; opis: string }> {
  if (!trybTestowy()) {
    return {
      href: "/wejscie",
      opis: "Twoje moduły, raport i karty zawodów. Wchodzisz kodem od prowadzącego, bez konta i bez hasła.",
    };
  }
  const pierwszy = await prisma.uczestnik.findFirst({ orderBy: { imie: "asc" } });
  if (!pierwszy) return { href: "/wejscie", opis: "Nie ma jeszcze żadnego uczestnika." };
  return {
    href: `/u/${pierwszy.kodDostepu}`,
    opis: `Tryb testowy: wchodzisz od razu, bez kodu, jako ${pierwszy.imie}. Innego uczestnika wybierzesz w „Wejdź kodem".`,
  };
}

/**
 * Wejście do programu: dwie drogi, uczestnika i prowadzącego.
 *
 * Uczestnik wchodzi kodem, bez rejestracji i bez hasła. Prowadzący ma jedno
 * konto na cały program.
 */
export default async function Strona() {
  const uczestnik = await wejscieUczestnika();
  return (
    <main className="mx-auto flex min-h-dvh max-w-[76rem] flex-col justify-center px-5 py-10 sm:px-8">
      <header className="relative">
        <Bramy klasa="pointer-events-none absolute -right-6 -top-10 hidden h-[20rem] w-[30rem] opacity-60 xl:block" />
        <div className="relative flex items-center gap-3">
          <Znak rozmiar={44} />
          <span>
            <span className="block text-tresc-duza font-extrabold tracking-tight">DreamWork</span>
            <span className="block text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
              Fundacja Służąc Życiu
            </span>
          </span>
        </div>

        <h1 className="relative mt-8 max-w-[24ch] text-tytul font-extrabold leading-[1.03] tracking-tight">
          Trzy drogi.
          <br />
          <span className="gradient-tytul">Wiele możliwości.</span>
        </h1>
        <p className="proza relative mt-5 max-w-czytelna">
          Program warsztatów rozwojowo&#8209;zawodowych dla osób 16–24. Cztery spotkania grupowe
          i jedna rozmowa indywidualna.
        </p>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Kafel
          href={uczestnik.href}
          nadtytul="Wchodzę jako"
          tytul="Uczestnik"
          opis={uczestnik.opis}
          akcja={uczestnik.href === "/wejscie" ? "Wejdź kodem" : "Wejdź od razu"}
          glowny
          ikona={
            <>
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
            </>
          }
        />
        <Kafel
          href="/prowadzacy"
          nadtytul="Wchodzę jako"
          tytul="Prowadzący"
          opis="Grupy, karty uczestników przed rozmową i ekran sesji indywidualnej. Jedno konto na cały program."
          akcja="Wejdź hasłem"
          ikona={
            <>
              <circle cx="9" cy="8" r="3.2" />
              <path d="M2.5 20c0-3.4 2.9-5.6 6.5-5.6 1.3 0 2.5.3 3.5.8" />
              <path d="M16.5 13.5a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2ZM19.6 16.1h2M11.9 16.1h2" />
            </>
          }
        />
      </div>

      <p className="mt-10 text-drobne text-atrament-slaby">
        Nie ma tu rejestracji ani zakładania konta. Uczestnik dostaje kod od prowadzącego.
        {uczestnik.href === "/wejscie" ? null : (
          <>
            {" "}
            <Link href="/wejscie" className="przejscie underline underline-offset-4 hover:text-akcent-jasny">
              Wejdź kodem albo wybierz innego uczestnika
            </Link>
            .
          </>
        )}
      </p>
    </main>
  );
}

function Kafel({
  href,
  nadtytul,
  tytul,
  opis,
  akcja,
  ikona,
  glowny,
}: {
  href: string;
  nadtytul: string;
  tytul: string;
  opis: string;
  akcja: string;
  ikona: React.ReactNode;
  glowny?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`przejscie szklo group flex flex-col p-7 sm:p-9 ${
        glowny ? "szklo-akcent" : "hover:border-akcent/40"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
          glowny ? "border-akcent/50 bg-akcent-tlo text-akcent-jasny" : "border-linia bg-szklo text-atrament-sciszony"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {ikona}
        </svg>
      </span>

      <span className="mt-6 block text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
        {nadtytul}
      </span>
      <span className="mt-1.5 block text-naglowek font-extrabold tracking-tight">{tytul}</span>
      <span className="proza mt-3 block">{opis}</span>

      <span
        className={`przejscie mt-7 inline-flex min-h-12 w-fit items-center gap-2 rounded-full px-7 text-male font-bold ${
          glowny
            ? "przycisk-gradient group-hover:brightness-110"
            : "przycisk-pigulka text-atrament group-hover:border-akcent/50 group-hover:text-akcent-jasny"
        }`}
      >
        {akcja}
        <span aria-hidden className="przejscie group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
