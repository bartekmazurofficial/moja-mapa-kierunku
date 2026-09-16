"use client";

/**
 * RAPORT KONCOWY „Moja mapa kierunku".
 *
 * Dziewiec sekcji, jedna strona, do przeczytania w dziesiec minut i do
 * wydrukowania. Zastapil raport warstwowy z dwudziestoma dwiema sekcjami,
 * ale **reguly odslaniania zostaly**: sekcja, ktorej warstwa jest jeszcze
 * zamknieta, nie renderuje sie z danymi, tylko z informacja, kiedy sie otworzy.
 * Dane tej sekcji w ogole nie powstaja po stronie serwera, wiec nie ma czego
 * podejrzec w zrodle strony.
 *
 * Trzy rzeczy, ktore wygladaja na uklad, a sa regula:
 *
 *   - **Zawody stoja dopiero w sekcji osmej**, po obszarach. Nigdy wczesniej.
 *   - **Nigdzie nie ma liczby dopasowania.** Kropki przy kompetencjach licza
 *     dowody z zycia, czyli zdarzenia, a nie wynik.
 *   - **Sekcja dziewiata jest pusta i taka zostaje.** Wypelnia ja prowadzacy
 *     razem z uczestnikiem na rozmowie, a nie algorytm.
 *
 * Paleta jest wlasna i nasycona, inaczej niz w reszcie produktu. Powod
 * i komplet kolorow: `components/raport/barwy.ts`.
 */

import { useState } from "react";
import type { WidokRaportu } from "@/lib/raport/serwer";
import type { Sciezka } from "@/lib/raport/sciezki";
import { SEKCJE_PO_ID } from "@/lib/raport/sekcje";
import { TEKSTY_KONCOWE } from "@/lib/content/koncowy";
import { BARWA, BARWA_SEKCJI, GRADIENT, PASTELE } from "./barwy";

const CIEN = "shadow-[0_1px_2px_rgba(22,32,60,.05),0_18px_48px_-32px_rgba(22,32,60,.4)]";

const SEKCJE: Array<{ nr: string; id: string; tytul: string; podpis: string; zrodlo: string }> = [
  {
    nr: "01",
    id: "to-jestes-ty",
    tytul: "To jesteś Ty",
    podpis: "Sześć cech, które wyszły najmocniej.",
    zrodlo: "profil_w_jednym_ekranie",
  },
  {
    nr: "02",
    id: "co-cie-ciagnie",
    tytul: "Co Cię ciągnie",
    podpis: "Pięć rzeczy wybieranych najczęściej z dwudziestu czterech.",
    zrodlo: "co_mnie_interesuje",
  },
  {
    nr: "03",
    id: "co-ci-wychodzi",
    tytul: "Co Ci wychodzi",
    podpis: "Kropki to potwierdzenia z życia, nie ocena.",
    zrodlo: "w_czym_dobry",
  },
  {
    nr: "04",
    id: "jakiej-pracy",
    tytul: "Jakiej pracy potrzebujesz",
    podpis: "Warunki, w których dasz z siebie najwięcej.",
    zrodlo: "srodowisko",
  },
  {
    nr: "05",
    id: "co-wazne",
    tytul: "Co jest dla Ciebie ważne",
    podpis: "Wartości, które wygrywały najczęściej.",
    zrodlo: "wartosci",
  },
  {
    nr: "06",
    id: "granice",
    tytul: "Na co się nie zgadzasz, a co akceptujesz",
    podpis: "Twoje granice i strefa komfortu.",
    zrodlo: "na_co_gotow",
  },
  {
    nr: "07",
    id: "twoje-slowa",
    tytul: "Twoje słowa",
    podpis: "Tego nikt nie liczył. Napisałeś to sam.",
    zrodlo: "wizja_zycia",
  },
  {
    nr: "08",
    id: "twoje-sciezki",
    tytul: "Twoje ścieżki",
    podpis: "Obszary zawodowe dopasowane do wyniku. To nie ranking.",
    zrodlo: "zawody",
  },
  {
    nr: "09",
    id: "co-dalej",
    tytul: "Co dalej",
    podpis: "Te trzy pola wypełniasz razem z prowadzącym, na rozmowie.",
    zrodlo: "moja_decyzja",
  },
];

export function RaportKoncowy({ widok, kodUczestnika }: { widok: WidokRaportu; kodUczestnika: string }) {
  const { raport } = widok;
  const k = raport.koncowy;
  const dostepne = new Set(widok.dostepne);
  const [pytanie, ustawPytanie] = useState(widok.pytanie ?? "");

  function zapiszPytanie(tresc: string) {
    ustawPytanie(tresc);
    void fetch("/api/ocena", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kod: kodUczestnika, pytanie: tresc }),
    });
  }

  /**
   * Kiedy otworzy sie sekcja, ktorej jeszcze nie wolno pokazac.
   *
   * Warstwe bierzemy z definicji sekcji zrodlowej, a nie z pierwszej lepszej
   * zamknietej: sekcja z drugiego spotkania nie ma mowic, ze otworzy sie po
   * rozmowie indywidualnej.
   */
  function kiedy(zrodlo: string): string | null {
    if (dostepne.has(zrodlo)) return null;
    const warstwa = SEKCJE_PO_ID.get(zrodlo)?.warstwa;
    return widok.zamkniete.find((w) => w.kod === warstwa)?.kiedy ?? "po kolejnym spotkaniu";
  }

  const sciezkiOtwarte = kiedy("zawody") === null;

  return (
    <div className="mx-auto flex w-full max-w-[74rem] flex-col gap-5 px-3 pb-16 pt-5 sm:px-5">
      <Czolo raport={raport} postep={widok.postep} />

      <Panel id="to-jestes-ty" kiedy={kiedy}>
        <ToJestesTy kafle={k?.kafle ?? []} />
      </Panel>

      {/* Dwie sekcje obok siebie: obie sa listami i obie mieszcza sie w polowie
          szerokosci, wiec para czyta sie jak jeden rozklad, a nie dwa ekrany. */}
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Panel id="co-cie-ciagnie" kiedy={kiedy}>
          <CoCieCiagnie raport={raport} />
        </Panel>
        <Panel id="co-ci-wychodzi" kiedy={kiedy}>
          <CoCiWychodzi raport={raport} />
        </Panel>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Panel id="jakiej-pracy" kiedy={kiedy}>
          <JakiejPracy raport={raport} />
        </Panel>
        <Panel id="co-wazne" kiedy={kiedy}>
          <CoWazne raport={raport} />
        </Panel>
      </div>

      <Panel
        id="granice"
        kiedy={kiedy}
        obok="Granice usuwają zawody z listy. Zgoda na trudne warunki otwiera te, których inni unikają."
      >
        <Granice raport={raport} />
      </Panel>

      <Panel id="twoje-slowa" kiedy={kiedy}>
        <TwojeSlowa raport={raport} />
      </Panel>

      <Panel id="twoje-sciezki" kiedy={kiedy}>
        <TwojeSciezki raport={raport} />
      </Panel>

      {sciezkiOtwarte && k?.sciezki?.czegoNieBrac.length ? (
        <section className={`rounded-[1.4rem] bg-panel p-6 ${CIEN} sm:p-8`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-naglowek font-extrabold tracking-[-0.025em] text-atrament">
              Czego nie brać
            </h2>
            <p className="max-w-[26rem] text-male leading-snug text-atrament-sciszony sm:text-right">
              {TEKSTY_KONCOWE.czegoNieBrac}
            </p>
          </div>
          <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
            {k.sciezki.czegoNieBrac.map((p) => (
              <li key={p.co} className="flex gap-4 border-b border-linia py-3.5">
                <span
                  className="w-[9rem] shrink-0 text-male font-bold leading-snug"
                  style={{ color: BARWA.wisnia }}
                >
                  {p.co}
                </span>
                <span className="min-w-0 flex-1 text-male leading-snug text-atrament-sciszony">
                  {p.dlaczego}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Panel
        id="co-dalej"
        kiedy={kiedy}
        odreczny={"Przyjdź z jednym pytaniem,\nna które raport nie odpowiedział."}
      >
        <CoDalej raport={raport} pytanie={pytanie} zapiszPytanie={zapiszPytanie} />
      </Panel>

      <Stopka />
    </div>
  );
}

/* ================================================================== */
/* SZKIELET                                                            */
/* ================================================================== */

function Znak({ rozmiar = "h-11 w-11" }: { rozmiar?: string }) {
  return (
    <span
      aria-hidden
      className={`flex ${rozmiar} shrink-0 items-center justify-center rounded-full`}
      style={{ background: BARWA.atrament }}
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="#ffffff" strokeWidth="2">
        <circle cx="12" cy="12" r="7.5" />
      </svg>
    </span>
  );
}

function Czolo({
  raport,
  postep,
}: {
  raport: WidokRaportu["raport"];
  postep: WidokRaportu["postep"];
}) {
  const zdanie = raport.profil_w_jednym_ekranie?.zdania?.[0] ?? null;
  return (
    <header className={`rounded-[1.4rem] bg-panel p-6 ${CIEN} sm:p-9`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-linia pb-5">
        <div className="flex flex-wrap items-center gap-3.5">
          <Znak />
          <span>
            <span className="block text-tresc-duza font-extrabold leading-tight text-atrament">
              DreamWork
            </span>
            <span className="block text-drobne font-semibold text-atrament-slaby">
              Fundacja Służąc Życiu
            </span>
          </span>
          <span className="hidden max-w-[16rem] border-l border-linia pl-3.5 text-drobne leading-snug text-atrament-slaby sm:block">
            Młodzi ludzie. Prawdziwe możliwości. Lepsze jutro.
          </span>
        </div>
        <p className="text-drobne font-bold uppercase tracking-[0.18em] text-atrament-slaby">
          Raport końcowy · {raport.dataWygenerowania}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-drobne font-bold uppercase tracking-[0.2em] text-atrament-slaby">
            Indywidualny raport rozwojowo-zawodowy
          </p>
          <h1 className="mt-2.5 text-naglowek-duzy font-extrabold leading-[1.02] tracking-[-0.04em] text-atrament sm:text-tytul">
            Moja mapa <span className="gradient-tytul">kierunku</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="rounded-lg px-3 py-1.5 text-male font-bold text-na-akcencie"
              style={{ background: BARWA.atrament }}
            >
              {raport.imie}
            </span>
            <span className="rounded-lg bg-plyta px-3 py-1.5 text-male font-semibold text-atrament-sciszony">
              {postep.ukonczonych} z {postep.wszystkich} testów ukończonych
            </span>
          </div>
        </div>
        <p
          aria-hidden
          className="odreczny hidden max-w-[13rem] whitespace-pre-line rounded-[1.2rem] border border-linia bg-plyta p-4 text-left lg:block"
        >
          {"Nie musisz wiedzieć\nwszystkiego dziś.\nWażne, że idziesz\nw dobrym kierunku."}
        </p>
      </div>

      {zdanie ? (
        <p
          className="mt-6 max-w-[40rem] rounded-[1.1rem] border-l-4 border-white/70 p-5 text-tresc-duza font-bold leading-snug text-na-akcencie"
          style={{ background: GRADIENT.zdanie }}
        >
          {zdanie}
        </p>
      ) : null}
    </header>
  );
}

function Panel({
  id,
  kiedy,
  obok,
  odreczny,
  children,
}: {
  id: string;
  kiedy: (zrodlo: string) => string | null;
  /** Zdanie przy prawej krawędzi nagłówka sekcji. */
  obok?: string;
  /** Dopisek odręczny przy prawej krawędzi, zamiast zdania. */
  odreczny?: string;
  children: React.ReactNode;
}) {
  const s = SEKCJE.find((x) => x.id === id)!;
  const zamknieta = kiedy(s.zrodlo);
  return (
    <section id={id} className={`scroll-mt-4 rounded-[1.4rem] bg-panel p-6 ${CIEN} sm:p-8`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span
            aria-hidden
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-boksowy text-drobne font-bold text-na-akcencie"
            style={{ background: BARWA_SEKCJI[id] }}
          >
            {s.nr}
          </span>
          <div>
            <h2 className="text-naglowek font-extrabold leading-tight tracking-[-0.025em] text-atrament">
              {s.tytul}
            </h2>
            <p className="mt-0.5 text-male text-atrament-sciszony">{s.podpis}</p>
          </div>
        </div>
        {obok ? (
          <p className="max-w-[24rem] text-male leading-snug text-atrament-sciszony sm:text-right">{obok}</p>
        ) : null}
        {odreczny ? (
          <p aria-hidden className="odreczny hidden max-w-[16rem] whitespace-pre-line text-right lg:block">
            {odreczny}
          </p>
        ) : null}
      </div>
      <div className="mt-5">{zamknieta ? <Zamknieta kiedy={zamknieta} /> : children}</div>
    </section>
  );
}

function Zamknieta({ kiedy }: { kiedy: string }) {
  return (
    <div className="rounded-[1.1rem] border border-dashed border-linia-mocna bg-plyta p-7 text-center">
      <p className="text-tresc font-semibold text-atrament-sciszony">Ta część otworzy się {kiedy}.</p>
      <p className="mt-1.5 text-male text-atrament-slaby">
        Kolejność ma znaczenie. Gdybyś zobaczył to teraz, następna część byłaby mniej Twoja.
      </p>
    </div>
  );
}

function Nadpis({ children, kolor }: { children: React.ReactNode; kolor?: string }) {
  return (
    <p
      className="text-drobne font-bold uppercase tracking-[0.16em]"
      style={{ color: kolor ?? BARWA.slaby }}
    >
      {children}
    </p>
  );
}

/* ================================================================== */
/* 01 TO JESTES TY                                                     */
/* ================================================================== */

function ToJestesTy({ kafle }: { kafle: Array<{ tekst: string; zrodlo: string }> }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kafle.map((kafel, i) => (
        <li
          key={kafel.tekst}
          className="flex min-h-[7.5rem] flex-col justify-between rounded-[1.1rem] p-4"
          style={{ background: GRADIENT.kafle[i % GRADIENT.kafle.length] }}
        >
          <span aria-hidden className="block h-1 w-7 rounded-full bg-white/80" />
          <span>
            <span className="block font-boksowy text-drobne font-bold text-white/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-male font-bold leading-snug text-na-akcencie">
              {kafel.tekst}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ================================================================== */
/* 02 CO CIE CIAGNIE                                                   */
/* ================================================================== */

function CoCieCiagnie({ raport }: { raport: WidokRaportu["raport"] }) {
  const sekcja = raport.co_mnie_interesuje;
  if (!sekcja) return null;
  return (
    <>
      <ol className="flex flex-col gap-2">
        {sekcja.gora.map((p, i) => (
          <li
            key={p.tytul}
            className="flex items-center gap-4 rounded-xl px-4 py-3"
            style={{ background: p.nieProbowal ? "#fff3e0" : "#f2f4fb" }}
          >
            <span
              className="font-boksowy text-tresc-duza font-extrabold leading-none"
              style={{ color: p.nieProbowal ? BARWA.rdza : BARWA.niebieski }}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 text-male font-semibold leading-snug text-atrament">
              {p.tytul}
            </span>
            {p.nieProbowal ? (
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-drobne font-bold text-na-akcencie"
                style={{ background: BARWA.rdza }}
              >
                jeszcze nie sprawdzone
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {sekcja.dol.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-linia pt-4">
          <Nadpis>Nie ciągnie</Nadpis>
          <p className="min-w-0 flex-1 text-male leading-snug text-atrament-sciszony">
            {sekcja.dol.map((p) => p.tytul.toLowerCase()).join(", ")}. To nie wada, to kierunek.
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 03 CO CI WYCHODZI                                                   */
/* ================================================================== */

function CoCiWychodzi({ raport }: { raport: WidokRaportu["raport"] }) {
  const sekcja = raport.w_czym_dobry;
  const atuty = raport.koncowy?.ukryteAtuty ?? [];
  if (!sekcja) return null;
  return (
    <>
      <ul className="flex flex-col">
        {sekcja.mocne.map((p) => (
          <li key={p.tytul} className="flex items-center gap-3 border-b border-linia py-2.5 last:border-b-0">
            <span className="min-w-0 flex-1 text-male font-semibold leading-snug text-atrament">
              {p.tytul}
            </span>
            <span aria-hidden className="flex shrink-0 gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-2.5 w-2.5 rounded-full"
                  style={{ background: i < p.dowody ? BARWA.fiolet : "#dfe3f2" }}
                />
              ))}
            </span>
            <span className="w-8 shrink-0 text-right font-boksowy text-drobne font-semibold text-atrament-slaby">
              {p.dowody}/3
            </span>
          </li>
        ))}
      </ul>
      {atuty.length > 0 ? (
        <div className="mt-5 rounded-[1.1rem] p-5" style={{ background: GRADIENT.atuty }}>
          <p className="text-drobne font-bold uppercase tracking-[0.16em] text-white/80">
            {atuty.length === 1 ? "Rzecz, o której nie wiedziałeś" : "Dwie rzeczy, o których nie wiedziałeś"}
          </p>
          <ul className="mt-3 flex flex-col gap-3">
            {atuty.map((a) => (
              <li key={a.nazwa} className="border-l-2 border-white/70 pl-3">
                <span className="text-male font-bold text-na-akcencie">{a.nazwa}</span>
                <span className="mt-0.5 block text-male leading-snug text-white/90">{a.dlaczego}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 04 JAKIEJ PRACY POTRZEBUJESZ                                        */
/* ================================================================== */

function JakiejPracy({ raport }: { raport: WidokRaportu["raport"] }) {
  const k = raport.koncowy;
  const warunki = k?.warunki ?? [];
  if (warunki.length === 0) {
    return (
      <p className="rounded-xl bg-plyta p-5 text-tresc text-atrament-sciszony">
        {raport.srodowisko?.komunikatGdyPusto ??
          "Na tym etapie jesteś elastyczny środowiskowo i to jest przewaga, nie brak."}
      </p>
    );
  }
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Nadpis kolor={BARWA.zielenSrednia}>Potrzebujesz</Nadpis>
          <ul className="mt-2 flex flex-col gap-2">
            {warunki.map((w) => (
              <li
                key={w.potrzebujesz}
                className="flex gap-2.5 rounded-xl px-3.5 py-2.5 text-male font-semibold leading-snug text-na-akcencie"
                style={{ background: GRADIENT.zgody }}
              >
                <span aria-hidden>✓</span>
                <span className="min-w-0 flex-1">{w.potrzebujesz}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Nadpis kolor={BARWA.wisnia}>Nie dla Ciebie</Nadpis>
          <ul className="mt-2 flex flex-col gap-2">
            {warunki.map((w) => (
              <li
                key={w.nieDlaCiebie}
                className="flex gap-2.5 rounded-xl px-3.5 py-2.5 text-male font-semibold leading-snug text-na-akcencie"
                style={{ background: GRADIENT.weta }}
              >
                <span aria-hidden>✕</span>
                <span className="min-w-0 flex-1">{w.nieDlaCiebie}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {(k?.przezyjeszBez.length ?? 0) > 0 ? (
        <p className="mt-4 text-male text-atrament-sciszony">
          <span className="font-semibold text-atrament">Lubisz, ale przeżyjesz bez tego: </span>
          {k!.przezyjeszBez.join(", ")}.
        </p>
      ) : null}
      {k?.doSprawdzenia ? (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-linia pt-4">
          <Nadpis kolor={BARWA.rdza}>Do sprawdzenia</Nadpis>
          <p className="min-w-0 flex-1 text-male leading-snug text-atrament-sciszony">
            Potrzebujesz tego: {k.doSprawdzenia.warunek}. Ale {k.doSprawdzenia.zdanie}.
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 05 CO JEST DLA CIEBIE WAZNE                                         */
/* ================================================================== */

function CoWazne({ raport }: { raport: WidokRaportu["raport"] }) {
  const sekcja = raport.wartosci;
  if (!sekcja) return null;
  return (
    <>
      <ol className="flex flex-col gap-3">
        {sekcja.gora.slice(0, 3).map((w, i) => (
          <li
            key={w.tytul}
            className="flex items-start gap-4 rounded-[1.1rem] p-5"
            style={{ background: GRADIENT.wartosci[i] }}
          >
            <span className="font-boksowy text-naglowek font-extrabold leading-none text-white/80">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-tresc-duza font-bold leading-snug text-na-akcencie">
                {w.tytul}
              </span>
              {w.opis ? (
                <span className="mt-1 block text-male leading-snug text-white/90">{w.opis}</span>
              ) : null}
              {w.dopisek ? (
                <span className="mt-1 block text-male font-semibold text-white/90">{w.dopisek}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      {raport.koncowy?.napiecie ? (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-linia pt-4">
          <Nadpis kolor={BARWA.rdza}>Napięcie</Nadpis>
          <p className="min-w-0 flex-1 text-male leading-snug text-atrament-sciszony">
            {raport.koncowy.napiecie.tresc}
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 06 GRANICE                                                          */
/* ================================================================== */

function Granice({ raport }: { raport: WidokRaportu["raport"] }) {
  const weta = raport.czego_nie_chce?.weta ?? [];
  const miekkie = raport.na_co_gotow?.nie ?? [];
  const przewaga = raport.koncowy?.przewaga ?? null;
  const zgody = przewaga?.pozycje ?? raport.koncowy?.zgody ?? [];
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1fr_1fr_15rem]">
      <div className="rounded-[1.1rem] p-5" style={{ background: GRADIENT.weta }}>
        <p className="text-drobne font-bold uppercase tracking-[0.16em] text-white/80">Tego nie chcesz</p>
        <p className="mt-1 text-male text-white/90">
          {weta.length > 0
            ? `${weta.length === 1 ? "Pierwsza pozycja to weto" : "Dwa pierwsze to weta"}: usuwają zawody całkowicie.`
            : "Nie wykluczyłeś niczego całkowicie."}
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {[...weta, ...miekkie].slice(0, 8).map((w, i) => (
            <li
              key={w}
              className="flex gap-2.5 rounded-lg bg-white/15 px-3 py-2 text-male leading-snug text-na-akcencie"
            >
              <span aria-hidden className="text-white/80">
                ✕
              </span>
              <span className={`min-w-0 flex-1 ${i < weta.length ? "font-bold" : ""}`}>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.1rem] p-5" style={{ background: GRADIENT.zgody }}>
        <p className="text-drobne font-bold uppercase tracking-[0.16em] text-white/80">Na to się zgadzasz</p>
        <p className="mt-1 text-male text-white/90">
          {przewaga
            ? `${przewaga.pozycje.length} warunków, na które większość się nie zgadza.`
            : "Warunki, które przyjmujesz bez zastrzeżeń."}
        </p>
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {zgody.map((p) => (
            <li
              key={p}
              className="flex gap-2 rounded-lg bg-white/15 px-3 py-2 text-male leading-snug text-na-akcencie"
            >
              <span aria-hidden className="text-white/80">
                ✓
              </span>
              <span className="min-w-0 flex-1">{p}</span>
            </li>
          ))}
        </ul>
        {przewaga ? <p className="mt-3 text-male leading-snug text-white/90">{przewaga.komunikat}</p> : null}
      </div>

      <p
        aria-hidden
        className="odreczny hidden whitespace-pre-line rounded-[1.1rem] border border-linia bg-plyta p-5 text-left lg:block"
      >
        {"Twoje granice są ważne.\nOne pomagają Ci wybrać\ndobrą drogę."}
      </p>
    </div>
  );
}

/* ================================================================== */
/* 07 TWOJE SLOWA                                                      */
/* ================================================================== */

function TwojeSlowa({ raport }: { raport: WidokRaportu["raport"] }) {
  const obszary = (raport.wizja_zycia?.obszary ?? []).filter((o) => o.tresc.some((t) => t.trim().length > 0));
  if (obszary.length === 0) {
    return (
      <p className="rounded-xl bg-plyta p-5 text-tresc text-atrament-sciszony">
        Ta część jest pusta, bo nic tu jeszcze nie napisałeś. Możesz wrócić do części „Jakiego życia
        chcesz" i ją uzupełnić.
      </p>
    );
  }
  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {obszary.map((o, i) => (
          <li
            key={o.tytul}
            className="flex flex-col justify-between gap-3 rounded-[1.1rem] p-4"
            style={{ background: PASTELE[i % PASTELE.length] }}
          >
            <p className="odreczny text-atrament">
              „{o.tresc.filter((t) => t.trim().length > 0).join(" · ")}"
            </p>
            <p
              className="w-fit rounded-full px-2.5 py-1 text-drobne font-bold uppercase tracking-[0.1em] text-na-akcencie"
              style={{ background: BARWA_SEKCJI["twoje-slowa"] }}
            >
              {o.tytul}
            </p>
          </li>
        ))}
      </ul>
      {raport.koncowy?.powtorzone ? (
        <div
          className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 rounded-[1.1rem] p-5"
          style={{ background: GRADIENT.ciemny }}
        >
          <p className="text-drobne font-bold uppercase tracking-[0.16em] text-white/70">Uwaga</p>
          <p className="min-w-0 flex-1 text-male leading-snug text-na-akcencie">
            {raport.koncowy.powtorzone.komunikat}
          </p>
        </div>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 08 TWOJE SCIEZKI                                                    */
/* ================================================================== */

function Blok({ tytul, pozycje }: { tytul: string; pozycje: string[] }) {
  if (pozycje.length === 0) return null;
  return (
    <div className="mt-3">
      <Nadpis>{tytul}</Nadpis>
      <ul className="mt-1.5 flex flex-col gap-0.5">
        {pozycje.map((p) => (
          <li
            key={p}
            className="border-l-2 pl-2.5 text-male leading-snug text-atrament"
            style={{ borderColor: BARWA.niebieski }}
          >
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function KartaSciezki({ s }: { s: Sciezka }) {
  return (
    <li
      className={`flex flex-col rounded-[1.1rem] border-2 bg-panel p-4 ${s.najblizej ? "" : "border-linia"}`}
      style={s.najblizej ? { borderColor: BARWA.amarant } : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-lg font-boksowy text-drobne font-bold text-na-akcencie"
          style={{ background: s.najblizej ? BARWA.amarant : BARWA.niebieski }}
        >
          {s.litera}
        </span>
        {s.najblizej ? (
          <span
            className="rounded-full px-2.5 py-1 text-drobne font-bold text-na-akcencie"
            style={{ background: BARWA.amarant }}
          >
            Najbliżej wyniku
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-tresc font-extrabold leading-snug text-atrament">{s.nazwa}</h3>
      <p
        className="mt-2 w-fit rounded-md px-2.5 py-1 text-drobne font-bold uppercase tracking-[0.08em] text-na-akcencie"
        style={{ background: BARWA.granat }}
      >
        Nauka: {s.ileNauki}
      </p>

      <Blok tytul="Dlaczego pasuje" pozycje={s.dlaczegoPasuje} />
      <Blok tytul="Przykładowe zawody" pozycje={s.zawody} />
      <Blok tytul="Ścieżka rozwoju" pozycje={s.sciezkaRozwoju} />
      <span aria-hidden className="block h-4 shrink-0" />

      {/* `mt-auto` przykleja plakietkę do dołu karty: karty w rzędzie mają
          różną długość list, a plakietka ma stać w jednej linii we wszystkich. */}
      <p
        className="mt-auto rounded-lg px-3 pb-2 pt-2 text-male font-bold text-na-akcencie"
        style={{ background: GRADIENT.zgody, marginTop: "auto" }}
      >
        ✓ {TEKSTY_KONCOWE.bezStudiow}
      </p>
    </li>
  );
}

function TwojeSciezki({ raport }: { raport: WidokRaportu["raport"] }) {
  const s = raport.koncowy?.sciezki;
  if (!s) return null;
  return (
    <>
      <ul className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {s.sciezki.map((sc) => (
          <KartaSciezki key={sc.litera} s={sc} />
        ))}
      </ul>

      {s.grupy.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {s.grupy.map((g, i) => (
            <div
              key={g.grupa}
              className="flex flex-col justify-between gap-4 rounded-[1.1rem] p-5"
              style={{ background: GRADIENT.progi[i % GRADIENT.progi.length] }}
            >
              <p className="text-drobne font-bold uppercase leading-snug tracking-[0.12em] text-white/90">
                {g.etykieta}
              </p>
              <p className="flex flex-wrap gap-2">
                {g.litery.map((l) => (
                  <span
                    key={l}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-boksowy text-male font-bold text-na-akcencie"
                  >
                    {l}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {s.jednaDecyzja ? (
        <div className="mt-3 rounded-[1.1rem] p-5" style={{ background: GRADIENT.decyzja }}>
          <p className="text-drobne font-bold uppercase tracking-[0.16em] text-white/80">
            Jedna decyzja zamiast ośmiu
          </p>
          <p className="mt-2 text-tresc font-bold leading-snug text-na-akcencie">{s.jednaDecyzja}</p>
        </div>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 09 CO DALEJ                                                         */
/* ================================================================== */

function PoleSesji({
  nr,
  tytul,
  podpis,
  tresc,
}: {
  nr: string;
  tytul: string;
  podpis: string;
  tresc: string | null;
}) {
  return (
    <div className="rounded-[1.1rem] border border-linia bg-plyta p-5">
      <p className="flex items-center gap-2 text-tresc font-bold text-atrament">
        <span aria-hidden style={{ color: BARWA.zielenSrednia }}>
          {nr}
        </span>
        {tytul}
      </p>
      <p className="mt-0.5 text-male text-atrament-slaby">{podpis}</p>
      {tresc ? (
        <p className="mt-3 text-male leading-relaxed text-atrament-sciszony">{tresc}</p>
      ) : (
        <div aria-hidden className="mt-4 flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-px bg-linia-mocna" />
          ))}
        </div>
      )}
    </div>
  );
}

function CoDalej({
  raport,
  pytanie,
  zapiszPytanie,
}: {
  raport: WidokRaportu["raport"];
  pytanie: string;
  zapiszPytanie: (t: string) => void;
}) {
  const kroki = raport.pierwsze_kroki?.kroki ?? [];
  return (
    <>
      <div className="grid gap-3 lg:grid-cols-3">
        <PoleSesji
          nr="①"
          tytul="Moja decyzja"
          podpis="co wybieram i dlaczego"
          tresc={raport.moja_decyzja?.tresc ?? null}
        />
        <PoleSesji
          nr="②"
          tytul="Pierwszy krok"
          podpis="jedna rzecz: co, kiedy, za ile"
          tresc={kroki.length > 0 ? kroki.join(" · ") : null}
        />
        <PoleSesji
          nr="③"
          tytul="Notatka prowadzącego"
          podpis="co warto zapamiętać"
          tresc={raport.notatka?.tresc ?? null}
        />
      </div>

      <div className="mt-4 rounded-[1.1rem] p-5" style={{ background: GRADIENT.decyzja }}>
        <p className="text-drobne font-bold uppercase tracking-[0.16em] text-white/80">
          Jedno pytanie na rozmowę
        </p>
        <p className="mt-2 max-w-[42rem] text-male leading-snug text-white/90">
          {TEKSTY_KONCOWE.jednoPytanie}
        </p>
        <label className="mt-3 block">
          <span className="sr-only">Twoje pytanie na rozmowę</span>
          <textarea
            id="pytanie-na-rozmowe"
            value={pytanie}
            onChange={(e) => zapiszPytanie(e.target.value)}
            rows={2}
            placeholder="Na co ten raport nie odpowiedział?"
            className="w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3 text-male text-na-akcencie placeholder:text-white/70 focus:border-white focus:outline-none"
          />
        </label>
      </div>
    </>
  );
}

function Stopka() {
  return (
    <footer
      className="grid items-center gap-4 rounded-[1.4rem] p-6 sm:p-7 lg:grid-cols-[auto_1fr_auto]"
      style={{ background: GRADIENT.ciemny }}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
        >
          <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="#ffffff" strokeWidth="2">
            <circle cx="12" cy="12" r="7.5" />
          </svg>
        </span>
        <span>
          <span className="block text-tresc font-extrabold leading-tight text-na-akcencie">DreamWork</span>
          <span className="block text-drobne text-white/80">Fundacja Służąc Życiu</span>
        </span>
      </span>
      <span className="text-male text-white/90 lg:text-center">
        Moja mapa kierunku · program rozwojowo-zawodowy dla osób 16–24
      </span>
      {/* Kolor wprost, nie klasą: `.odreczny` ustawia własny fiolet i na
          ciemnym pasie stopki zostawał nieczytelny. */}
      <span
        aria-hidden
        className="odreczny hidden whitespace-pre-line text-right lg:block"
        style={{ color: "#ffffff" }}
      >
        {"Więcej dobrych ludzi\nna dobrych miejscach"}
      </span>
    </footer>
  );
}
