import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { otwarteModuly, SPOTKANIE_MODULU } from "@/lib/moduly/otwarcie";
import {
  CZESCI_MODULOW,
  KOLEJNOSC_MODULOW,
  NAZWY_MODULOW,
  liczbaPozycjiModulu,
} from "@/lib/moduly/ekrany";
import { PO_CO } from "@/lib/moduly/opisy";
import { Bramy } from "@/components/pulpit/Bramy";
import { ZnakModulu } from "@/components/pulpit/ZnakModulu";
import { KOLORY_MODULOW } from "@/lib/ui/kolory";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

type Stan = "zamkniety" | "przed" | "wtrakcie" | "gotowy";

/**
 * Lista modułów: siedem kroków w jednym szeregu.
 *
 * Karta zamknięta jest widoczna i podpisana, a nie ukryta. Uczestnik ma
 * wiedzieć, co go czeka i kiedy się otworzy, zamiast patrzeć na skróconą
 * listę przez trzy tygodnie i zgadywać, czy to już wszystko.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [{ zakonczone, odpowiedziWModule }, otwarte] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    otwarteModuly(uczestnik.grupaId),
  ]);

  const stan = (m: KodModulu): Stan => {
    const gotowe = zakonczone.get(m)?.size ?? 0;
    if (!otwarte.has(m)) return "zamkniety";
    if (gotowe >= CZESCI_MODULOW[m].length) return "gotowy";
    // Zaczęte to także moduł przerwany w połowie pierwszej części: liczy się
    // pierwsza zapisana odpowiedź, nie domknięcie całej części.
    return gotowe > 0 || (odpowiedziWModule.get(m) ?? 0) > 0 ? "wtrakcie" : "przed";
  };

  const ukonczone = KOLEJNOSC_MODULOW.filter((m) => stan(m) === "gotowy").length;
  const dalej =
    KOLEJNOSC_MODULOW.find((m) => stan(m) === "wtrakcie") ??
    KOLEJNOSC_MODULOW.find((m) => stan(m) === "przed");

  return (
    <div className="flex flex-col gap-4">
      <header className="szklo relative overflow-hidden p-6 sm:p-8 lg:pr-[26rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-akcent/20 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-4 bottom-0 hidden h-[15rem] w-[23rem] opacity-80 lg:block" />
        <p aria-hidden className="odreczny absolute right-[20rem] top-8 hidden max-w-[12rem] xl:block">
          Lepiej siebie poznać, niż przypadkiem przeżyć życie.
        </p>
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">Twój program</p>
        <h1 className="mt-2 text-naglowek font-extrabold leading-[1.1] tracking-tight sm:text-naglowek-duzy">
          Moduły
          <br />
          <span className="gradient-tytul">Krok po kroku do większej jasności.</span>
        </h1>
        <p className="mt-3 max-w-czytelna text-tresc leading-relaxed text-atrament-sciszony">
          Siedem modułów. Każdy odkrywa inny kawałek tego, co już o sobie wiesz. Wypełniaj je po
          kolei: kolejność jest częścią metody, a nie porządkiem na liście.
        </p>
      </header>

      <ol className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
        {KOLEJNOSC_MODULOW.map((m, i) => (
          <li key={m}>
            <KartaModulu
              kod={kod}
              modul={m}
              numer={i + 1}
              stan={stan(m)}
              spotkanie={SPOTKANIE_MODULU[m]}
              odpowiedzi={odpowiedziWModule.get(m) ?? 0}
              pozycji={liczbaPozycjiModulu(m)}
            />
          </li>
        ))}
      </ol>

      <footer className="szklo flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex items-center gap-4">
          <Pierscien ile={ukonczone} z={KOLEJNOSC_MODULOW.length} />
          <div>
            <p className="text-tresc-duza font-bold text-atrament">Twój postęp</p>
            <p className="mt-0.5 text-male leading-snug text-atrament-sciszony">
              {ukonczone === 0
                ? "Zaczynasz. Pierwszy moduł jest najkrótszy."
                : ukonczone >= KOLEJNOSC_MODULOW.length
                  ? "Masz za sobą wszystkie siedem części."
                  : `Jesteś w trakcie budowania swojego profilu. Przed Tobą jeszcze ${KOLEJNOSC_MODULOW.length - ukonczone} ${KOLEJNOSC_MODULOW.length - ukonczone === 1 ? "moduł" : "moduły"}.`}
            </p>
          </div>
        </div>

        <div aria-hidden className="hidden h-12 w-px bg-linia lg:block" />

        <div className="flex flex-1 items-center gap-3">
          <span aria-hidden className="znak-sekcji bg-akcent-tlo text-akcent-jasny">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20v-8" />
              <path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5Z" />
              <path d="M12 14c0-2.5-1.7-4-4-4 0 2.5 1.7 4 4 4Z" />
            </svg>
          </span>
          <p className="text-male leading-snug text-atrament-sciszony">
            Każda odpowiedź przybliża Cię do pracy,
            <br className="hidden sm:block" /> która ma dla Ciebie sens.
          </p>
        </div>

        {dalej ? (
          <Link
            href={`/u/${kod}/modul/${dalej}`}
            className="przejscie przycisk-gradient inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full px-7 text-male font-bold"
          >
            {stan(dalej) === "wtrakcie" ? "Kontynuuj moduł" : "Zacznij moduł"}: {NAZWY_MODULOW[dalej]}
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </footer>
    </div>
  );
}

/** Pierścień postępu: ułamek modułów, nie procent odpowiedzi. */
function Pierscien({ ile, z }: { ile: number; z: number }) {
  const obwod = 2 * Math.PI * 26;
  return (
    <span className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center">
      <svg viewBox="0 0 60 60" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <circle cx="30" cy="30" r="26" fill="none" stroke="var(--color-linia)" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="var(--color-akcent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={obwod}
          strokeDashoffset={obwod * (1 - ile / z)}
        />
      </svg>
      <span className="relative text-tresc-duza font-extrabold tabular-nums text-atrament">
        {ile}
        <span className="text-male text-atrament-slaby">/{z}</span>
      </span>
    </span>
  );
}

function KartaModulu({
  kod,
  modul,
  numer,
  stan,
  spotkanie,
  odpowiedzi,
  pozycji,
}: {
  kod: string;
  modul: KodModulu;
  numer: number;
  stan: Stan;
  spotkanie: number;
  odpowiedzi: number;
  pozycji: number;
}) {
  const kolor = KOLORY_MODULOW[modul];
  const zamkniety = stan === "zamkniety";
  const postep = stan === "gotowy" ? 1 : pozycji > 0 ? Math.min(1, odpowiedzi / pozycji) : 0;

  const tresc = (
    <>
      {/* Pas z numerem i znakiem modułu. Zamiast zdjęcia, którego jeszcze nie ma. */}
      <span
        aria-hidden
        className="relative flex h-24 items-center justify-center rounded-xl"
        style={{
          background: zamkniety
            ? "var(--color-tlo)"
            : `linear-gradient(150deg, ${kolor.tlo}, #ffffff 85%)`,
          boxShadow: `inset 0 0 0 1px ${zamkniety ? "var(--color-linia)" : kolor.obwod}`,
          color: zamkniety ? "var(--color-atrament-slaby)" : kolor.atrament,
        }}
      >
        <ZnakModulu modul={modul} rozmiar={38} />
        <span className="absolute left-2.5 top-2 text-drobne font-extrabold tabular-nums">
          {String(numer).padStart(2, "0")}
        </span>
        <span className="absolute right-2 top-2">
          <Odznaka stan={stan} />
        </span>
      </span>

      <span className="mt-3 block text-male font-bold leading-snug text-atrament">
        {NAZWY_MODULOW[modul]}
      </span>
      <span className="mt-1 block text-drobne leading-relaxed text-atrament-slaby">
        {PO_CO[modul]}
      </span>

      <span className="mt-auto block pt-3">
        {zamkniety ? null : (
          <span aria-hidden className="pasek-cienki mb-2 block">
            <span style={{ width: `${Math.max(4, postep * 100)}%` } as CSSProperties} />
          </span>
        )}
        <span
          className={`flex items-center gap-1.5 text-drobne font-semibold ${
            stan === "gotowy"
              ? "text-akcent-jasny"
              : stan === "wtrakcie"
                ? "text-uwaga"
                : "text-atrament-slaby"
          }`}
        >
          {zamkniety ? <Klodka /> : null}
          {stan === "gotowy"
            ? "Ukończony"
            : stan === "wtrakcie"
              ? `W toku · ${odpowiedzi} z ${pozycji}`
              : stan === "przed"
                ? "Do zrobienia"
                : `Otworzy się na ${spotkanie}. spotkaniu`}
        </span>
      </span>
    </>
  );

  if (zamkniety) {
    return <div className="flex h-full flex-col rounded-karta border border-linia bg-tlo/70 p-3">{tresc}</div>;
  }

  return (
    <Link
      href={`/u/${kod}/modul/${modul}`}
      className="przejscie szklo flex h-full flex-col p-3"
      style={
        stan === "wtrakcie"
          ? { borderColor: kolor.neon, boxShadow: `0 16px 34px -22px ${kolor.neon}` }
          : undefined
      }
    >
      {tresc}
    </Link>
  );
}

/** Ptaszek dla ukończonego, strzałka dla zaczętego, kłódka dla zamkniętego. */
function Odznaka({ stan }: { stan: Stan }) {
  if (stan === "gotowy") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full text-na-akcencie" style={{ background: "#067a45" }}>
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (stan === "wtrakcie") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-uwaga text-na-akcencie">
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (stan === "przed") {
    return <span className="block h-6 w-6 rounded-full border border-linia-mocna bg-panel/70" />;
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-linia bg-panel/70 text-atrament-slaby">
      <Klodka />
    </span>
  );
}

function Klodka() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}
