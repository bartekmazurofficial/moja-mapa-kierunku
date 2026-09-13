"use client";

/**
 * Raport "Moja mapa kierunku".
 *
 * To nie jest wynik testu, tylko mapa, ktora uczestnik sam narysowal przez
 * cztery tygodnie. Raport istnieje od pierwszego dnia i rosnie warstwami:
 * sekcje zamkniete sa widoczne i wygaszone, z informacja, kiedy sie otworza.
 */

import { useState } from "react";
import Link from "next/link";
import { Bramy } from "@/components/pulpit/Bramy";
import { Obraz } from "@/components/Ikona";
import { useSearchParams } from "next/navigation";
import { BLOKADA_A2, KOLEJNOSC_WYSWIETLANIA, SEKCJE_PO_ID, WARSTWY } from "@/lib/raport/sekcje";
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
  const wszystkichSekcji = KOLEJNOSC_WYSWIETLANIA.length;

  /** Kiedy otworzy się sekcja, której jeszcze nie ma. */
  const kiedy = (id: string): string => {
    const def = SEKCJE_PO_ID.get(id);
    return WARSTWY.find((w) => w.kod === def?.warstwa)?.kiedy ?? "później";
  };

  /** Otwiera sekcję w pełnym raporcie i przewija do niej. */
  function otworz(id: string) {
    ustawRozwiniete((p) => new Set([...p, id]));
    requestAnimationFrame(() => document.getElementById(`sekcja-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const pierwszeSlowa = raport.wizja_zycia?.obszary.find((o) => o.tresc.some((t) => t.trim()));

  return (
    <div className="flex flex-col gap-5">
      {/* NAGŁÓWEK */}
      <header className="szklo relative overflow-hidden p-6 sm:p-8 lg:pr-[24rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-akcent/20 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-8 bottom-0 hidden h-[14rem] w-[22rem] opacity-70 lg:block" />
        <p aria-hidden className="odreczny absolute right-[21rem] top-7 hidden xl:block">
          Ten kierunek
          <br />
          ma sens.
        </p>
        <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">Twój osobisty raport</p>
        <h1 className="mt-3 text-naglowek font-extrabold leading-tight tracking-tight sm:text-naglowek-duzy">
          Moja mapa kierunku.
          <br />
          <span className="gradient-tytul">Coraz lepiej rozumiem siebie.</span>
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          Nie wynik testu. Uporządkowanie tego, co sam o sobie napisałeś przez cztery tygodnie.
          Kolejne części otwierają się po spotkaniach.
        </p>
      </header>

      {widok.blokadaA2 ? (
        <p className="rounded-xl border border-uwaga/30 bg-uwaga-tlo px-5 py-4 text-tresc leading-relaxed text-uwaga">
          {BLOKADA_A2}
        </p>
      ) : null}

      {/* SKRÓT: siatka płyt różnej wielkości. Każda pokazuje kawałek jednej
          sekcji i prowadzi do niej w pełnym raporcie niżej. Sekcja zamknięta
          jest widoczna i podpisana, kiedy się otworzy. */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Plyta szer="lg:col-span-4" tinta="#f2ecff" znak="slowa" tytul="Twoje słowa" dostepna>
          {pierwszeSlowa ? (
            <>
              <p className="text-drobne uppercase tracking-[0.1em] text-atrament-slaby">{pierwszeSlowa.tytul}</p>
              <p className="mt-2 text-tresc leading-relaxed text-atrament">
                {skroc(pierwszeSlowa.tresc.join(" "), 220)}
              </p>
              <PrzyciskPlyty onClick={() => otworz("wizja_zycia")}>Przeczytaj całość</PrzyciskPlyty>
            </>
          ) : (
            <p className="text-male leading-relaxed text-atrament-sciszony">
              Ta część czeka na Twoje słowa. Wypełnisz ją w module „Jakiego życia chcesz" i trafi tu
              dosłownie, bez skracania.
            </p>
          )}
        </Plyta>

        <Plyta
          szer="lg:col-span-4"
          znak="wiemy"
          tytul="To już o Tobie wiemy"
          odznaka={`${widoczneSekcje.length} z ${wszystkichSekcji}`}
          dostepna
        >
          {raport.profil_w_jednym_ekranie ? (
            <ul className="flex flex-col gap-2">
              {raport.profil_w_jednym_ekranie.zdania.slice(0, 5).map((z, i) => (
                <li key={i} className="flex items-start gap-2.5 text-male leading-relaxed text-atrament">
                  <Ptaszek />
                  <span>{z}</span>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="text-male leading-relaxed text-atrament-sciszony">
                Otwarte sekcje raportu. Profil w jednym ekranie złoży się z nich na czwartym spotkaniu.
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {widoczneSekcje.slice(0, 6).map((id) => (
                  <li key={id} className="flex items-start gap-2.5 text-male text-atrament">
                    <Ptaszek />
                    <span>{SEKCJE_PO_ID.get(id)?.tytul}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Plyta>

        <Plyta
          szer="lg:col-span-4"
          tinta="#fff6dc"
          znak="obszary"
          tytul="Moje najmocniejsze obszary"
          dostepna={dostepne.has("obszary")}
          kiedy={kiedy("obszary")}
        >
          {raport.obszary ? (
            <>
              <ul className="flex flex-col gap-2">
                {raport.obszary.pozycje.slice(0, 3).map((o, i) => (
                  <li key={o.nazwa}>
                    <button
                      type="button"
                      onClick={() => otworz("obszary")}
                      className="przejscie flex w-full items-center gap-3 rounded-xl border border-linia bg-panel px-3.5 py-2.5 text-left hover:border-akcent/45"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-akcent-tlo text-male font-bold text-akcent-jasny">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-male font-semibold text-atrament">{o.nazwa}</span>
                        <span className="block text-drobne text-atrament-slaby">{o.pasmoOpis}</span>
                      </span>
                      <span aria-hidden className="text-atrament-slaby">→</span>
                    </button>
                  </li>
                ))}
              </ul>
              {raport.obszary.komunikatNieostry ? (
                <p className="mt-3 text-drobne leading-relaxed text-atrament-sciszony">{raport.obszary.komunikatNieostry}</p>
              ) : null}
            </>
          ) : null}
        </Plyta>

        <Plyta
          szer="lg:col-span-3"
          znak="dzialam"
          tytul="Jak działam naturalnie"
          dostepna={dostepne.has("jak_dzialam")}
          kiedy={kiedy("jak_dzialam")}
        >
          {raport.jak_dzialam ? (
            <>
              <ul className="flex flex-col gap-1.5">
                {raport.jak_dzialam.osie
                  .filter((o) => o.wyrazista)
                  .slice(0, 5)
                  .map((o) => (
                    <li key={o.kod} className="rounded-lg border border-linia bg-panel px-3 py-2 text-male text-atrament">
                      {o.opis}
                    </li>
                  ))}
              </ul>
              <PrzyciskPlyty onClick={() => otworz("jak_dzialam")}>Wszystkie osie</PrzyciskPlyty>
            </>
          ) : null}
        </Plyta>

        <Plyta
          szer="lg:col-span-3"
          tinta="#e3faed"
          znak="wazne"
          tytul="Czego potrzebuję od pracy"
          dostepna={dostepne.has("wartosci")}
          kiedy={kiedy("wartosci")}
        >
          {raport.wartosci ? (
            <>
              <ul className="flex flex-col gap-2">
                {raport.wartosci.gora.slice(0, 4).map((w) => (
                  <li key={w.tytul} className="flex items-start gap-2.5 text-male text-atrament">
                    <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-neon-zielony" />
                    <span className="leading-snug">{w.tytul}</span>
                  </li>
                ))}
              </ul>
              <PrzyciskPlyty onClick={() => otworz("wartosci")}>Dlaczego to ważne</PrzyciskPlyty>
            </>
          ) : null}
        </Plyta>

        <Plyta
          szer="lg:col-span-3"
          tinta="#ffe9ee"
          znak="zawody"
          tytul="Zawody warte sprawdzenia"
          dostepna={dostepne.has("zawody")}
          kiedy={kiedy("zawody")}
        >
          {raport.zawody ? (
            <>
              <ul className="flex flex-col gap-2">
                {raport.zawody.pozycje
                  .flatMap((p) => p.zawody)
                  .slice(0, 3)
                  .map((z) => (
                    <li key={z.kod}>
                      <Link
                        href={`/u/${kodUczestnika}/zawod/${z.kod}`}
                        className="przejscie flex items-center gap-3 rounded-xl border border-linia bg-panel px-3 py-2 hover:border-akcent/45"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                          {z.znakObszaru ? <Obraz klucz={z.znakObszaru} rozmiar={36} /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-male font-semibold text-atrament">{z.nazwa}</span>
                          <span className="block truncate text-drobne text-atrament-slaby">{z.obszar}</span>
                        </span>
                        <span aria-hidden className="text-atrament-slaby">→</span>
                      </Link>
                    </li>
                  ))}
              </ul>
              <Link
                href={`/u/${kodUczestnika}/zawody`}
                className="przejscie mt-3 inline-flex text-male font-semibold text-akcent-jasny hover:underline"
              >
                Zobacz więcej zawodów <span aria-hidden className="ml-1">→</span>
              </Link>
            </>
          ) : null}
        </Plyta>

        <Plyta
          szer="lg:col-span-3"
          tinta="#e9f0ff"
          znak="drogi"
          tytul="Trzy możliwe drogi"
          dostepna={dostepne.has("trzy_drogi")}
          kiedy={kiedy("trzy_drogi")}
        >
          {raport.trzy_drogi ? (
            <>
              <ul className="flex flex-col gap-2">
                {raport.trzy_drogi.drogi.map((d, i) => (
                  <li key={d.etykieta}>
                    <button
                      type="button"
                      onClick={() => otworz("trzy_drogi")}
                      className="przejscie flex w-full items-center gap-3 rounded-xl border border-linia bg-panel px-3 py-2 text-left hover:border-akcent/45"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-male font-bold text-na-akcencie"
                        style={{ background: ["#0a3ac9", "#5b21b6", "#c00030"][i] ?? "#0a3ac9" }}
                      >
                        {d.etykieta}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-male font-semibold text-atrament">{d.obszar}</span>
                        <span className="block truncate text-drobne text-atrament-slaby">
                          {d.przyklad} · {d.czas}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p aria-hidden className="odreczny mt-3 text-right text-[1.1rem]">
                Każda z nich może być Twoja.
              </p>
            </>
          ) : null}
        </Plyta>

        {widok.zamkniete.length > 0 ? (
          <Plyta szer="lg:col-span-12" znak="klodka" tytul="Co odkryjemy później" dostepna>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {widok.zamkniete.map((w) => (
                <div key={w.kod} className="rounded-xl border border-dashed border-linia-mocna px-4 py-3">
                  <p className="text-male font-semibold text-atrament-sciszony">{w.nazwa}</p>
                  <p className="mt-0.5 text-drobne text-atrament-slaby">{w.kiedy}</p>
                  <p className="mt-2 text-drobne leading-relaxed text-atrament-slaby">{w.sekcje.join(" · ")}</p>
                </div>
              ))}
            </div>
          </Plyta>
        ) : null}
      </div>

      {/* PEŁNY RAPORT: sekcja po sekcji, każda do rozwinięcia. */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-4 px-1">
          <h2 className="text-drobne uppercase tracking-[0.16em] text-atrament-slaby">Pełny raport, sekcja po sekcji</h2>
          <p className="text-drobne text-atrament-slaby">{widoczneSekcje.length} otwartych sekcji</p>
        </div>

        {raport.profil_w_jednym_ekranie ? (
          <section id="sekcja-profil_w_jednym_ekranie" className="szklo szklo-akcent mb-4 p-6 sm:p-8">
            <h2 className="text-naglowek font-extrabold leading-snug tracking-tight">Mój profil w jednym ekranie</h2>
            <div className="proza mt-4">
              {raport.profil_w_jednym_ekranie.zdania.map((z, i) => (
                <p key={i}>{z}</p>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid items-start gap-3 lg:grid-cols-2">
          {widoczneSekcje
            .filter((id) => id !== "profil_w_jednym_ekranie")
            .map((id) => {
              const def = SEKCJE_PO_ID.get(id)!;
              const otwarta = rozwiniete.has(id);
              return (
                <section
                  key={id}
                  id={`sekcja-${id}`}
                  className={`szklo overflow-hidden ${otwarta ? "szklo-akcent lg:col-span-2" : ""}`}
                >
                  <h2>
                    <button
                      type="button"
                      onClick={() => przelacz(id)}
                      aria-expanded={otwarta}
                      className="przejscie flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:text-akcent-jasny"
                    >
                      <span className="text-tresc-duza font-bold leading-snug">{def.tytul}</span>
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
                  {otwarta ? <div className="px-5 pb-6 sm:px-6">{zawartosc(id)}</div> : null}
                </section>
              );
            })}
        </div>
      </section>

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

      {/* ZAKOŃCZENIE: jedno zdanie i jedno wyjście dalej. */}
      <footer className="szklo flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span aria-hidden className="znak-sekcji bg-akcent-tlo text-akcent-jasny">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3 1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3Z" />
              <path d="m5 16 .8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
            </svg>
          </span>
          <div>
            <p className="text-tresc-duza font-bold text-atrament">To nie jest koniec. To dobry początek.</p>
            <p className="mt-0.5 text-male text-atrament-sciszony">
              Każda odpowiedź przybliża Cię do życia, które bardziej do Ciebie pasuje.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {mozePobracPdf ? (
            <a
              href={`/u/${kodUczestnika}/raport/pdf`}
              className="przejscie przycisk-pigulka inline-flex min-h-12 items-center rounded-full px-6 text-male font-semibold"
            >
              Pobierz PDF
            </a>
          ) : null}
          <Link
            href={`/u/${kodUczestnika}`}
            className="przejscie przycisk-gradient inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-male font-bold"
          >
            Kontynuuj swoją drogę <span aria-hidden>→</span>
          </Link>
        </div>
      </footer>

      <p className="px-2 text-drobne leading-relaxed text-atrament-slaby">{raport.stopka}</p>
    </div>
  );
}

function skroc(tekst: string, ile: number): string {
  const t = tekst.trim();
  if (t.length <= ile) return t;
  const ucie = t.slice(0, ile);
  return `${ucie.slice(0, Math.max(ucie.lastIndexOf(" "), ile - 30))}…`;
}

const ZNAKI_PLYT: Record<string, { sciezki: string[]; tlo: string; atrament: string }> = {
  slowa: { sciezki: ["m5 19 1-4L16.5 4.5l3 3L9 18z", "M14.5 6.5l3 3", "M5 19h4"], tlo: "#f2ecff", atrament: "#5b21b6" },
  wiemy: { sciezki: ["M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", "M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  obszary: { sciezki: ["m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"], tlo: "#fff6dc", atrament: "#8a5a00" },
  dzialam: { sciezki: ["M5 20V11", "M12 20V5", "M19 20v-6"], tlo: "#e2f8fb", atrament: "#056b78" },
  wazne: { sciezki: ["M12 3 4 12l8 9 8-9-8-9Z", "M4 12h16"], tlo: "#e3faed", atrament: "#067a45" },
  zawody: { sciezki: ["M4 7h16v11H4z", "M8 7V5h8v2"], tlo: "#ffe9ee", atrament: "#c00030" },
  drogi: { sciezki: ["M6 20c0-6 12-6 12-12", "M6 20v-3", "M18 8V5"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  klodka: { sciezki: ["M5 11h14v9H5z", "M8 11V8a4 4 0 0 1 8 0v3"], tlo: "#f0eefa", atrament: "#4a4a6a" },
};

/**
 * Płyta skrótu. Zamknięta jest widoczna i podpisana: uczestnik ma wiedzieć,
 * że coś tu będzie i kiedy, a nie patrzeć na dziurę w siatce.
 */
function Plyta({
  szer,
  tinta,
  znak,
  tytul,
  odznaka,
  dostepna,
  kiedy,
  children,
}: {
  szer: string;
  tinta?: string;
  znak: string;
  tytul: string;
  odznaka?: string;
  dostepna: boolean;
  kiedy?: string;
  children: React.ReactNode;
}) {
  const z = ZNAKI_PLYT[znak];
  return (
    <section
      className={`szklo relative flex min-w-0 flex-col p-5 ${szer}`}
      style={tinta && dostepna ? { background: `linear-gradient(160deg, ${tinta} 0%, rgba(255,255,255,0.85) 70%)` } : undefined}
    >
      <div className="mb-3 flex items-center gap-3">
        {z ? (
          <span aria-hidden className="znak-sekcji" style={{ background: z.tlo, color: z.atrament }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {z.sciezki.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
          </span>
        ) : null}
        <h2 className="min-w-0 flex-1 text-tresc-duza font-bold leading-tight text-atrament">{tytul}</h2>
        {odznaka ? (
          <span className="shrink-0 rounded-full border border-akcent/30 bg-akcent-tlo px-2.5 py-0.5 text-drobne font-bold tabular-nums text-akcent-jasny">
            {odznaka}
          </span>
        ) : null}
      </div>
      {dostepna ? (
        children
      ) : (
        <p className="flex items-start gap-2 text-male leading-relaxed text-atrament-sciszony">
          <svg aria-hidden viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          <span>Otworzy się {kiedy}.</span>
        </p>
      )}
    </section>
  );
}

function PrzyciskPlyty({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="przejscie mt-3 inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-linia-mocna bg-panel px-4 text-male font-semibold text-atrament-sciszony hover:border-akcent/45 hover:text-akcent-jasny"
    >
      {children} <span aria-hidden>→</span>
    </button>
  );
}

function Ptaszek() {
  return (
    <span aria-hidden className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-akcent text-na-akcencie">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
