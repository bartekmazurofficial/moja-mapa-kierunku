"use client";

/**
 * Raport "Moja mapa kierunku".
 *
 * To nie jest wynik testu, tylko mapa, ktora uczestnik sam narysowal przez
 * cztery tygodnie. Raport istnieje od pierwszego dnia i rosnie warstwami:
 * sekcje zamkniete sa widoczne i wygaszone, z informacja, kiedy sie otworza.
 */

import { useState } from "react";
import { Bramy } from "@/components/pulpit/Bramy";
import { useSearchParams } from "next/navigation";
import { BLOKADA_A2, KOLEJNOSC_WYSWIETLANIA, SEKCJE_PO_ID } from "@/lib/raport/sekcje";
import type { WidokRaportu } from "@/lib/raport/serwer";
import {
  CoMnieInteresuje,
  CzegoUnikac,
  JakDzialam,
  Kierunki,
  Lista,
  LubieAWychodzi,
  Naglowek,
  Obszary,
  PunktStartu,
  TrzyDrogi,
  Wartosci,
  WCzymDobry,
  WizjaZycia,
  Zawody,
} from "./Sekcje";

export function RaportWidok({ widok, kodUczestnika }: { widok: WidokRaportu; kodUczestnika: string }) {
  const { raport } = widok;
  const [oceny, ustawOceny] = useState<Record<string, string>>(widok.oceny);
  const [pytanie, ustawPytanie] = useState(widok.pytanie ?? "");
  // Sekcje mozna otworzyc z adresu, np. ?otwarte=trzy_drogi. Uzywane przy
  // wracaniu z karty zawodu i przy linkach z panelu prowadzacego.
  const parametry = useSearchParams();
  const [rozwiniete, ustawRozwiniete] = useState<Set<string>>(
    () => new Set(["profil_w_jednym_ekranie", ...(parametry.get("otwarte")?.split(",") ?? [])]),
  );
  const dostepne = new Set(widok.dostepne);

  function przelacz(id: string) {
    ustawRozwiniete((poprzednie) => {
      const nowe = new Set(poprzednie);
      if (nowe.has(id)) nowe.delete(id);
      else nowe.add(id);
      return nowe;
    });
  }

  function zapiszOcene(zawod: string, ocena: string) {
    ustawOceny((p) => ({ ...p, [zawod]: ocena }));
    void fetch("/api/ocena", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kod: kodUczestnika, zawod, ocena }),
    });
  }

  function zapiszPytanie(tresc: string) {
    ustawPytanie(tresc);
    void fetch("/api/ocena", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kod: kodUczestnika, pytanie: tresc }),
    });
  }

  const zawartosc = (id: string): React.ReactNode => {
    switch (id) {
      case "punkt_startu":
        return raport.punkt_startu ? <PunktStartu dane={raport.punkt_startu} /> : null;
      case "co_mnie_interesuje":
        return raport.co_mnie_interesuje ? <CoMnieInteresuje dane={raport.co_mnie_interesuje} /> : null;
      case "czego_nie_sprawdzilem":
        return raport.czego_nie_sprawdzilem ? (
          <div>
            <Lista pozycje={raport.czego_nie_sprawdzilem.pozycje} />
            <p className="mt-3 text-tresc leading-relaxed text-atrament-sciszony">
              {raport.czego_nie_sprawdzilem.podpis}
            </p>
          </div>
        ) : null;
      case "jak_dzialam":
        return raport.jak_dzialam ? <JakDzialam dane={raport.jak_dzialam} /> : null;
      case "srodowisko":
        return raport.srodowisko ? (
          <div>
            <Lista pozycje={raport.srodowisko.warunki} />
            {raport.srodowisko.komunikatGdyPusto ? (
              <p className="mt-3 text-tresc leading-relaxed text-atrament-sciszony">
                {raport.srodowisko.komunikatGdyPusto}
              </p>
            ) : null}
          </div>
        ) : null;
      case "w_czym_dobry":
        return raport.w_czym_dobry ? <WCzymDobry dane={raport.w_czym_dobry} /> : null;
      case "lubie_a_wychodzi":
        return raport.lubie_a_wychodzi ? <LubieAWychodzi dane={raport.lubie_a_wychodzi} /> : null;
      case "wartosci":
        return raport.wartosci ? <Wartosci dane={raport.wartosci} /> : null;
      case "ksztalt_zycia":
        return raport.ksztalt_zycia ? (
          <div>
            <Lista pozycje={raport.ksztalt_zycia.parametry.map((p) => p.opis)} />
            <p className="mt-3 text-tresc leading-relaxed text-atrament-sciszony">
              {raport.ksztalt_zycia.zdanie}
            </p>
          </div>
        ) : null;
      case "wizja_zycia":
        return raport.wizja_zycia ? <WizjaZycia dane={raport.wizja_zycia} /> : null;
      case "czego_nie_chce":
        return raport.czego_nie_chce ? (
          <div className="flex flex-col gap-5">
            {raport.czego_nie_chce.zdania.length > 0 ? (
              <div className="flex flex-col gap-2">
                {raport.czego_nie_chce.zdania.map((z, i) => (
                  <p key={i} className="text-tresc leading-relaxed">
                    {z}
                  </p>
                ))}
              </div>
            ) : null}
            {raport.czego_nie_chce.weta.length > 0 ? (
              <div>
                <Naglowek>Twoje granice nie do przejścia</Naglowek>
                <Lista pozycje={raport.czego_nie_chce.weta} />
              </div>
            ) : null}
          </div>
        ) : null;
      case "na_co_gotow":
        return raport.na_co_gotow ? (
          <div className="flex flex-col gap-5">
            <div>
              <Naglowek>Tak</Naglowek>
              <Lista pozycje={raport.na_co_gotow.tak} />
            </div>
            <div>
              <Naglowek>Jeszcze nie wiem</Naglowek>
              <Lista pozycje={raport.na_co_gotow.moze} />
              <p className="mt-2 text-male text-atrament-sciszony">{raport.na_co_gotow.podpisMoze}</p>
            </div>
            <div>
              <Naglowek>Nie</Naglowek>
              <Lista pozycje={raport.na_co_gotow.nie} />
            </div>
          </div>
        ) : null;
      case "obszary":
        return raport.obszary ? <Obszary dane={raport.obszary} /> : null;
      case "zawody":
        return raport.zawody ? (
          <Zawody
            dane={raport.zawody}
            kodUczestnika={kodUczestnika}
            oceny={oceny}
            naOcene={zapiszOcene}
          />
        ) : null;
      case "kierunki":
        return raport.kierunki ? <Kierunki dane={raport.kierunki} /> : null;
      case "umiejetnosci":
        return raport.umiejetnosci ? (
          <div className="flex flex-col gap-3">
            {raport.umiejetnosci.pozycje.map((p) => (
              <div key={p.tytul}>
                <p className="text-tresc-duza">{p.tytul}</p>
                <p className="text-tresc text-atrament-sciszony">{p.opis}</p>
              </div>
            ))}
          </div>
        ) : null;
      case "trzy_drogi":
        return raport.trzy_drogi ? <TrzyDrogi dane={raport.trzy_drogi} /> : null;
      case "czego_unikac":
        return raport.czego_unikac ? <CzegoUnikac dane={raport.czego_unikac} /> : null;
      case "moja_decyzja":
        return raport.moja_decyzja?.tresc ? (
          <p className="text-tresc-duza font-semibold leading-relaxed">{raport.moja_decyzja.tresc}</p>
        ) : (
          <p className="text-male text-atrament-slaby">Tu znajdzie się to, co powiesz na rozmowie.</p>
        );
      case "pierwsze_kroki":
        return raport.pierwsze_kroki && raport.pierwsze_kroki.kroki.length > 0 ? (
          <Lista pozycje={raport.pierwsze_kroki.kroki} />
        ) : (
          <p className="text-male text-atrament-slaby">Ustalicie je razem na rozmowie.</p>
        );
      case "notatka":
        return raport.notatka?.tresc ? (
          <p className="text-tresc leading-relaxed">{raport.notatka.tresc}</p>
        ) : (
          <p className="text-male text-atrament-slaby">
            Tu trafi tylko to, co prowadzący przeczyta Ci na głos podczas rozmowy.
          </p>
        );
      default:
        return null;
    }
  };

  const widoczneSekcje = KOLEJNOSC_WYSWIETLANIA.filter((id) => dostepne.has(id));
  const mozePobracPdf = dostepne.has("trzy_drogi");

  return (
    <div className="flex flex-col gap-6">
      <header className="szklo relative overflow-hidden p-7 sm:p-9 lg:pr-[24rem]">
        <Bramy klasa="pointer-events-none absolute -right-8 bottom-0 hidden h-[14rem] w-[22rem] opacity-70 lg:block" />
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
          Moja mapa kierunku
        </p>
        <h1 className="mt-3 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
          {raport.imie},
          <br />
          <span className="gradient-tytul">to jest Twoja mapa.</span>
        </h1>
        <p className="proza mt-4 max-w-czytelna">
          Nie wynik testu. Uporządkowanie tego, co sam o sobie napisałeś przez cztery tygodnie.
          Kolejne części otwierają się po spotkaniach.
        </p>
      </header>

      {widok.blokadaA2 ? (
        <p className="rounded-xl border border-uwaga/30 bg-uwaga-tlo px-5 py-4 text-tresc leading-relaxed text-uwaga">
          {BLOKADA_A2}
        </p>
      ) : null}

      {raport.profil_w_jednym_ekranie ? (
        <section className="szklo szklo-akcent p-6 sm:p-8">
          <h2 className="text-naglowek font-extrabold tracking-tight leading-snug">Mój profil w jednym ekranie</h2>
          <div className="proza mt-4">
            {raport.profil_w_jednym_ekranie.zdania.map((z, i) => (
              <p key={i}>{z}</p>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3">
        {widoczneSekcje
          .filter((id) => id !== "profil_w_jednym_ekranie")
          .map((id) => {
            const def = SEKCJE_PO_ID.get(id)!;
            const otwarta = rozwiniete.has(id);
            return (
              <section key={id} className={`szklo overflow-hidden ${otwarta ? "szklo-akcent" : ""}`}>
                <h2>
                  <button
                    type="button"
                    onClick={() => przelacz(id)}
                    aria-expanded={otwarta}
                    className="przejscie flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:text-akcent-jasny"
                  >
                    <span className="text-naglowek-maly font-bold leading-snug">{def.tytul}</span>
                    <span
                      aria-hidden
                      className={`przejscie flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        otwarta
                          ? "rotate-45 border-akcent/50 bg-akcent-tlo text-akcent-jasny"
                          : "border-linia-mocna text-atrament-sciszony"
                      }`}
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h2>
                {otwarta ? <div className="px-6 pb-7">{zawartosc(id)}</div> : null}
              </section>
            );
          })}
      </div>

      {widok.zamkniete.length > 0 ? (
        <section className="szklo p-6">
          <Naglowek>Co się jeszcze otworzy</Naglowek>
          <ul className="flex flex-col gap-3">
            {widok.zamkniete.map((w) => (
              <li key={w.kod} className="rounded-xl border border-dashed border-linia-mocna px-5 py-4">
                <p className="text-tresc-duza text-atrament-sciszony">{w.nazwa}</p>
                <p className="mt-0.5 text-male text-atrament-slaby">{w.kiedy}</p>
                <p className="mt-2 text-drobne text-atrament-slaby">{w.sekcje.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dostepne.has("zawody") ? (
        <section className="szklo p-6">
          <h2 className="text-naglowek-maly font-bold">Pytanie na rozmowę indywidualną</h2>
          <p className="mt-1 text-male text-atrament-sciszony">
            Jedno pytanie, które chcesz zadać. Prowadzący zobaczy je przed rozmową.
          </p>
          <textarea
            value={pytanie}
            onChange={(e) => zapiszPytanie(e.target.value)}
            rows={3}
            className="pole mt-3 leading-relaxed"
          />
        </section>
      ) : null}

      <footer className="szklo p-6">
        {mozePobracPdf ? (
          <a
            href={`/u/${kodUczestnika}/raport/pdf`}
            className="przejscie inline-flex min-h-12 items-center gap-2 rounded-xl border border-linia-mocna bg-szklo px-6 text-male font-semibold hover:border-akcent/50 hover:text-akcent-jasny"
          >
            Pobierz raport w PDF
          </a>
        ) : null}
        <p className="mt-6 text-drobne leading-relaxed text-atrament-slaby">{raport.stopka}</p>
      </footer>
    </div>
  );
}
