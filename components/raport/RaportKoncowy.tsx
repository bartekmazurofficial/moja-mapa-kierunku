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
 */

import { useState } from "react";
import type { WidokRaportu } from "@/lib/raport/serwer";
import type { Sciezka } from "@/lib/raport/sciezki";
import { SEKCJE_PO_ID } from "@/lib/raport/sekcje";
import { TEKSTY_KONCOWE } from "@/lib/content/koncowy";
import { Bramy } from "@/components/pulpit/Bramy";

const SEKCJE: Array<{ nr: string; id: string; tytul: string; zrodlo: string }> = [
  { nr: "01", id: "to-jestes-ty", tytul: "To jesteś Ty", zrodlo: "profil_w_jednym_ekranie" },
  { nr: "02", id: "co-cie-ciagnie", tytul: "Co Cię ciągnie", zrodlo: "co_mnie_interesuje" },
  { nr: "03", id: "co-ci-wychodzi", tytul: "Co Ci wychodzi", zrodlo: "w_czym_dobry" },
  { nr: "04", id: "jakiej-pracy", tytul: "Jakiej pracy potrzebujesz", zrodlo: "srodowisko" },
  { nr: "05", id: "co-wazne", tytul: "Co jest dla Ciebie ważne", zrodlo: "wartosci" },
  { nr: "06", id: "granice", tytul: "Na co się nie zgadzasz", zrodlo: "na_co_gotow" },
  { nr: "07", id: "twoje-slowa", tytul: "Twoje słowa", zrodlo: "wizja_zycia" },
  { nr: "08", id: "twoje-sciezki", tytul: "Twoje ścieżki", zrodlo: "zawody" },
  { nr: "09", id: "co-dalej", tytul: "Co dalej", zrodlo: "moja_decyzja" },
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
    const zamknieta = widok.zamkniete.find((w) => w.kod === warstwa);
    return zamknieta?.kiedy ?? "po kolejnym spotkaniu";
  }

  return (
    <div className="mx-auto w-full max-w-[72rem] px-4 pb-16 pt-6 sm:px-6">
      <Czolo raport={raport} />
      <Nawigacja />

      {SEKCJE.map((s) => (
        <Sekcja key={s.id} nr={s.nr} id={s.id} tytul={s.tytul} kiedy={kiedy(s.zrodlo)}>
          {s.id === "to-jestes-ty" && <ToJestesTy kafle={k?.kafle ?? []} zdania={raport.profil_w_jednym_ekranie?.zdania ?? []} />}
          {s.id === "co-cie-ciagnie" && <CoCieCiagnie raport={raport} />}
          {s.id === "co-ci-wychodzi" && <CoCiWychodzi raport={raport} />}
          {s.id === "jakiej-pracy" && <JakiejPracy raport={raport} />}
          {s.id === "co-wazne" && <CoWazne raport={raport} />}
          {s.id === "granice" && <Granice raport={raport} />}
          {s.id === "twoje-slowa" && <TwojeSlowa raport={raport} />}
          {s.id === "twoje-sciezki" && <TwojeSciezki raport={raport} />}
          {s.id === "co-dalej" && (
            <CoDalej raport={raport} pytanie={pytanie} zapiszPytanie={zapiszPytanie} />
          )}
        </Sekcja>
      ))}

      <NaKoniec />
    </div>
  );
}

/* ================================================================== */
/* SZKIELET                                                            */
/* ================================================================== */

function Czolo({ raport }: { raport: WidokRaportu["raport"] }) {
  return (
    <header className="szklo relative overflow-hidden rounded-karta p-6 sm:p-10">
      <Bramy klasa="pointer-events-none absolute -right-10 -top-8 hidden h-[15rem] w-[24rem] opacity-50 lg:block" />
      <p className="text-drobne font-bold uppercase tracking-[0.2em] text-atrament-slaby">
        Raport końcowy · {raport.dataWygenerowania}
      </p>
      <h1 className="mt-3 text-naglowek-duzy font-extrabold leading-[1.05] tracking-[-0.03em] text-atrament sm:text-tytul">
        Moja mapa <span className="gradient-tytul">kierunku</span>
      </h1>
      <p className="mt-3 text-tresc-duza font-semibold text-atrament">{raport.imie}</p>

      <div className="mt-6 max-w-[42rem] rounded-karta border border-linia bg-panel/70 p-5">
        <p className="text-drobne font-bold uppercase tracking-[0.16em] text-akcent-jasny">
          Jak czytać ten raport
        </p>
        <div className="proza mt-2.5">
          {TEKSTY_KONCOWE.jakCzytac.map((z) => (
            <p key={z}>{z}</p>
          ))}
        </div>
      </div>
    </header>
  );
}

function Nawigacja() {
  return (
    <nav aria-label="Sekcje raportu" className="mt-5 flex flex-wrap gap-2">
      {SEKCJE.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="przejscie rounded-full border border-linia bg-panel px-3.5 py-1.5 text-male font-semibold text-atrament-sciszony hover:border-linia-mocna hover:text-atrament"
        >
          <span className="mr-1.5 font-boksowy text-drobne text-atrament-slaby">{s.nr}</span>
          {s.tytul}
        </a>
      ))}
    </nav>
  );
}

function Sekcja({
  nr,
  id,
  tytul,
  kiedy,
  children,
}: {
  nr: string;
  id: string;
  tytul: string;
  kiedy: string | null;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-8 scroll-mt-4">
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <span className="przycisk-gradient rounded-lg px-2.5 py-1 font-boksowy text-male font-bold text-na-akcencie">
          {nr}
        </span>
        <h2 className="text-naglowek font-extrabold tracking-[-0.02em] text-atrament sm:text-naglowek-duzy">
          {tytul}
        </h2>
      </div>
      {kiedy ? <Zamknieta kiedy={kiedy} /> : children}
    </section>
  );
}

function Zamknieta({ kiedy }: { kiedy: string }) {
  return (
    <div className="rounded-karta border border-dashed border-linia-mocna bg-plyta p-6 text-center">
      <p className="text-tresc font-semibold text-atrament-sciszony">Ta część otworzy się {kiedy}.</p>
      <p className="mt-1.5 text-male text-atrament-slaby">
        Kolejność ma znaczenie. Gdybyś zobaczył to teraz, następna część byłaby mniej Twoja.
      </p>
    </div>
  );
}

function Karta({ children, klasa = "" }: { children: React.ReactNode; klasa?: string }) {
  return <div className={`rounded-karta border border-linia bg-panel p-5 sm:p-6 ${klasa}`}>{children}</div>;
}

function Nadpis({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-drobne font-bold uppercase tracking-[0.16em] text-atrament-slaby">{children}</p>
  );
}

/* ================================================================== */
/* 01 TO JESTES TY                                                     */
/* ================================================================== */

function ToJestesTy({ kafle, zdania }: { kafle: Array<{ tekst: string; zrodlo: string }>; zdania: string[] }) {
  return (
    <>
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
        Sześć rzeczy, które wyszły najmocniej w ośmiu częściach programu. Każda z innego pytania.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kafle.map((kafel) => (
          <li key={kafel.tekst} className="rounded-karta border border-linia bg-panel p-5">
            <span aria-hidden className="block h-1 w-9 rounded-full przycisk-gradient" />
            <p className="mt-3.5 text-tresc-duza font-bold leading-snug text-atrament">{kafel.tekst}</p>
            <p className="mt-1.5 text-drobne uppercase tracking-[0.12em] text-atrament-slaby">
              {kafel.zrodlo}
            </p>
          </li>
        ))}
      </ul>
      {zdania.length > 0 ? (
        <Karta klasa="mt-4">
          <Nadpis>Jednym zdaniem</Nadpis>
          <div className="proza mt-2">
            {zdania.map((z) => (
              <p key={z}>{z}</p>
            ))}
          </div>
          <p className="mt-3 text-male text-atrament-slaby">{TEKSTY_KONCOWE.zdanieOZdaniu}</p>
        </Karta>
      ) : null}
    </>
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
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
        Pięć rzeczy, które wybierałeś najczęściej, z dwudziestu czterech, które Ci pokazaliśmy.
      </p>
      <ol className="flex flex-col gap-2.5">
        {sekcja.gora.map((p, i) => (
          <li key={p.tytul} className="flex gap-4 rounded-karta border border-linia bg-panel p-4 sm:p-5">
            <span className="font-boksowy text-naglowek font-extrabold leading-none text-akcent-jasny">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-tresc-duza font-bold leading-snug text-atrament">{p.tytul}</p>
                {p.nieProbowal ? (
                  <span className="rounded-full bg-uwaga-tlo px-2.5 py-0.5 text-drobne font-bold uppercase tracking-[0.1em] text-uwaga">
                    jeszcze nie sprawdzone
                  </span>
                ) : null}
              </div>
              {p.opis ? <p className="mt-1 text-tresc leading-snug text-atrament-sciszony">{p.opis}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      {sekcja.dol.length > 0 ? (
        <Karta klasa="mt-4">
          <Nadpis>A czego nie</Nadpis>
          <p className="mt-2 text-tresc text-atrament-sciszony">
            Nie ciągnie Cię: {sekcja.dol.map((p) => p.tytul.toLowerCase()).join(", ")}. To nie wada, tylko
            kierunek.
          </p>
        </Karta>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 03 CO CI WYCHODZI                                                   */
/* ================================================================== */

function Kropki({ ile }: { ile: number }) {
  return (
    <span aria-label={`${ile} z trzech`} className="flex shrink-0 gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden
          className={`block h-2.5 w-2.5 rounded-full ${i < ile ? "bg-akcent" : "bg-linia-mocna"}`}
        />
      ))}
    </span>
  );
}

function CoCiWychodzi({ raport }: { raport: WidokRaportu["raport"] }) {
  const sekcja = raport.w_czym_dobry;
  const atuty = raport.koncowy?.ukryteAtuty ?? [];
  if (!sekcja) return null;
  return (
    <>
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">{TEKSTY_KONCOWE.kropki}</p>
      <ul className="flex flex-col gap-1.5">
        {sekcja.mocne.map((p) => (
          <li
            key={p.tytul}
            className="flex items-center gap-4 rounded-xl border border-linia bg-panel px-4 py-3"
          >
            <span className="min-w-0 flex-1 text-tresc font-semibold text-atrament">{p.tytul}</span>
            <span className="hidden text-male text-atrament-slaby sm:block">
              {p.dowody === 0 ? "bez przykładów" : p.dowody === 1 ? "1 przykład" : `${p.dowody} przykłady`}
            </span>
            <Kropki ile={p.dowody} />
          </li>
        ))}
      </ul>
      {atuty.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {atuty.map((a, i) => (
            <Karta key={a.nazwa} klasa="bg-akcent-tlo/60">
              <Nadpis>Rzecz, o której nie wiedziałeś · {i + 1}</Nadpis>
              <p className="mt-2 text-tresc-duza font-bold text-atrament">{a.nazwa}</p>
              <p className="mt-1.5 text-tresc leading-snug text-atrament-sciszony">{a.dlaczego}</p>
            </Karta>
          ))}
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
      <Karta>
        <p className="text-tresc text-atrament-sciszony">
          {raport.srodowisko?.komunikatGdyPusto ??
            "Na tym etapie jesteś elastyczny środowiskowo i to jest przewaga, nie brak."}
        </p>
      </Karta>
    );
  }
  return (
    <>
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
        Rzeczy, bez których będzie Ci ciężko, i ich druga strona.
      </p>
      <div className="overflow-hidden rounded-karta border border-linia">
        <div className="grid grid-cols-2 bg-plyta">
          <p className="border-r border-linia px-4 py-2.5 text-drobne font-bold uppercase tracking-[0.14em] text-zgoda">
            Potrzebujesz
          </p>
          <p className="px-4 py-2.5 text-drobne font-bold uppercase tracking-[0.14em] text-kasowanie">
            Nie dla Ciebie
          </p>
        </div>
        {warunki.map((w) => (
          <div key={w.potrzebujesz} className="grid grid-cols-2 border-t border-linia bg-panel">
            <p className="border-r border-linia px-4 py-3 text-tresc leading-snug text-atrament">
              {w.potrzebujesz}
            </p>
            <p className="px-4 py-3 text-tresc leading-snug text-atrament-sciszony">{w.nieDlaCiebie}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(k?.przezyjeszBez.length ?? 0) > 0 ? (
          <Karta>
            <Nadpis>Lubisz, ale przeżyjesz bez tego</Nadpis>
            <p className="mt-2 text-tresc text-atrament-sciszony">{k!.przezyjeszBez.join(" · ")}</p>
          </Karta>
        ) : null}
        {k?.doSprawdzenia ? (
          <Karta klasa="bg-uwaga-tlo/70 border-uwaga/30">
            <Nadpis>Jedna rzecz do sprawdzenia</Nadpis>
            <p className="mt-2 text-tresc leading-snug text-atrament">
              Powiedziałeś, że potrzebujesz tego: {k.doSprawdzenia.warunek}. Ale {k.doSprawdzenia.zdanie}.
            </p>
            <p className="mt-2 text-male text-atrament-sciszony">
              To nie problem. To pierwsza rzecz, którą warto o sobie sprawdzić.
            </p>
          </Karta>
        ) : null}
      </div>
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
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
        Rzeczy, które wygrywały najczęściej, kiedy trzeba było wybierać.
      </p>
      <ol className="flex flex-col gap-2.5">
        {sekcja.gora.slice(0, 3).map((w, i) => (
          <li key={w.tytul} className="flex gap-4 rounded-karta border border-linia bg-panel p-4 sm:p-5">
            <span className="font-boksowy text-naglowek font-extrabold leading-none text-akcent-jasny">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-tresc-duza font-bold leading-snug text-atrament">{w.tytul}</p>
              {w.opis ? <p className="mt-1 text-tresc leading-snug text-atrament-sciszony">{w.opis}</p> : null}
              {w.dopisek ? (
                <p className="mt-1.5 text-male font-semibold text-akcent-jasny">{w.dopisek}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {raport.koncowy?.napiecie ? (
        <Karta klasa="mt-4 bg-uwaga-tlo/70 border-uwaga/30">
          <Nadpis>Jedna rzecz, która się bije</Nadpis>
          <p className="mt-2 text-tresc-duza font-bold text-atrament">{raport.koncowy.napiecie.tytul}</p>
          <p className="mt-1.5 text-tresc leading-snug text-atrament-sciszony">
            {raport.koncowy.napiecie.tresc}
          </p>
        </Karta>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 06 NA CO SIE NIE ZGADZASZ                                           */
/* ================================================================== */

function Granice({ raport }: { raport: WidokRaportu["raport"] }) {
  const weta = raport.czego_nie_chce?.weta ?? [];
  const miekkie = raport.na_co_gotow?.nie ?? [];
  const przewaga = raport.koncowy?.przewaga ?? null;
  return (
    <>
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
        Dwa poziomy: to, co wykluczyłeś całkowicie, i to, co po prostu Ci nie leży.
      </p>
      <div className="grid gap-3 lg:grid-cols-2">
        <Karta>
          <Nadpis>To wykluczyłeś całkowicie</Nadpis>
          {weta.length === 0 ? (
            <p className="mt-2 text-tresc text-atrament-sciszony">
              Nie wykluczyłeś niczego całkowicie. Wszystkie drogi zostają otwarte.
            </p>
          ) : (
            <>
              <ul className="mt-2.5 flex flex-col gap-1.5">
                {weta.map((w) => (
                  <li
                    key={w}
                    className="rounded-lg border border-kasowanie/25 bg-kasowanie-tlo px-3.5 py-2 text-tresc font-semibold text-atrament"
                  >
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-male text-atrament-sciszony">
                {TEKSTY_KONCOWE.wetaOpis} {TEKSTY_KONCOWE.wetaZostaje}
              </p>
            </>
          )}
        </Karta>
        <Karta>
          <Nadpis>To po prostu Ci nie leży</Nadpis>
          {miekkie.length === 0 ? (
            <p className="mt-2 text-tresc text-atrament-sciszony">Tu nic nie odrzuciłeś.</p>
          ) : (
            <>
              <p className="mt-2.5 text-tresc leading-snug text-atrament-sciszony">
                {miekkie.join(" · ")}
              </p>
              <p className="mt-3 text-male text-atrament-slaby">{TEKSTY_KONCOWE.miekkieNie}</p>
            </>
          )}
        </Karta>
      </div>
      {przewaga ? (
        <Karta klasa="mt-3 bg-zgoda-tlo/60 border-zgoda/25">
          <Nadpis>A teraz druga strona</Nadpis>
          <p className="mt-2 text-tresc text-atrament">
            Zgodziłeś się na {przewaga.pozycje.length} rzeczy, na które większość ludzi się nie zgadza.
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {przewaga.pozycje.map((p) => (
              <li
                key={p}
                className="rounded-full border border-zgoda/25 bg-panel px-3 py-1 text-male font-semibold text-atrament"
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-tresc leading-snug text-atrament-sciszony">{przewaga.komunikat}</p>
        </Karta>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 07 TWOJE SLOWA                                                      */
/* ================================================================== */

function TwojeSlowa({ raport }: { raport: WidokRaportu["raport"] }) {
  const obszary = (raport.wizja_zycia?.obszary ?? []).filter((o) => o.tresc.some((t) => t.trim().length > 0));
  if (obszary.length === 0) {
    return (
      <Karta>
        <p className="text-tresc text-atrament-sciszony">
          Ta część jest pusta, bo nic tu jeszcze nie napisałeś. Możesz wrócić do części „Jakiego życia
          chcesz" i ją uzupełnić.
        </p>
      </Karta>
    );
  }
  return (
    <>
      <p className="mb-4 max-w-czytelna text-tresc text-atrament-sciszony">
        Tego nikt nie liczył. Napisałeś to sam.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {obszary.map((o) => (
          <li key={o.tytul} className="rounded-karta border border-linia bg-panel p-5">
            <p className="odreczny text-atrament">
              {o.tresc.filter((t) => t.trim().length > 0).join(" · ")}
            </p>
            <p className="mt-3 inline-block rounded-full bg-plyta px-3 py-1 text-drobne font-bold uppercase tracking-[0.12em] text-atrament-slaby">
              {o.tytul}
            </p>
          </li>
        ))}
      </ul>
      {raport.koncowy?.powtorzone ? (
        <Karta klasa="mt-4 bg-akcent-tlo/60">
          <Nadpis>Uwaga</Nadpis>
          <p className="odreczny mt-2 text-atrament">„{raport.koncowy.powtorzone.tresc}"</p>
          <p className="mt-2.5 text-tresc leading-snug text-atrament-sciszony">
            {raport.koncowy.powtorzone.komunikat}
          </p>
        </Karta>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 08 TWOJE SCIEZKI                                                    */
/* ================================================================== */

function KartaSciezki({ s }: { s: Sciezka }) {
  return (
    <li
      className={`flex flex-col rounded-karta border-2 bg-panel p-5 ${
        s.najblizej ? "border-akcent" : "border-linia"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="przycisk-gradient rounded-lg px-2.5 py-1 font-boksowy text-male font-bold text-na-akcencie">
          {s.litera}
        </span>
        {s.najblizej ? (
          <span className="rounded-full bg-akcent-tlo px-2.5 py-0.5 text-drobne font-bold uppercase tracking-[0.1em] text-akcent-jasny">
            najbliżej wyniku
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-tresc-duza font-extrabold leading-snug text-atrament">{s.nazwa}</h3>
      <p className="mt-2 inline-block w-fit rounded-full bg-plyta px-3 py-1 text-drobne font-bold uppercase tracking-[0.1em] text-atrament-sciszony">
        Nauka: {s.ileNauki}
      </p>

      <Blok tytul="Dlaczego pasuje" pozycje={s.dlaczegoPasuje} />
      <Blok tytul="Przykładowe zawody" pozycje={s.zawody} />
      <Blok tytul="Ścieżka rozwoju" pozycje={s.sciezkaRozwoju} />

      <p className="mt-3 text-male leading-snug text-atrament-sciszony">{s.coWartoWiedziec}</p>
      <p className="mt-4 rounded-lg bg-zgoda-tlo px-3 py-2 text-male font-bold text-zgoda">
        ✓ {TEKSTY_KONCOWE.bezStudiow}
      </p>
    </li>
  );
}

function Blok({ tytul, pozycje }: { tytul: string; pozycje: string[] }) {
  if (pozycje.length === 0) return null;
  return (
    <div className="mt-3.5">
      <Nadpis>{tytul}</Nadpis>
      <ul className="mt-1.5 flex flex-col gap-1">
        {pozycje.map((p) => (
          <li key={p} className="border-l-2 border-linia-mocna pl-2.5 text-male leading-snug text-atrament">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TwojeSciezki({ raport }: { raport: WidokRaportu["raport"] }) {
  const s = raport.koncowy?.sciezki;
  if (!s) return null;
  return (
    <>
      <div className="proza mb-4 max-w-czytelna">
        {TEKSTY_KONCOWE.sciezkiWstep.map((z) => (
          <p key={z}>{z}</p>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {s.sciezki.map((sc) => (
          <KartaSciezki key={sc.litera} s={sc} />
        ))}
      </ul>

      {s.grupy.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {s.grupy.map((g) => (
            <div key={g.grupa} className="rounded-karta border border-linia bg-plyta p-4">
              <p className="text-drobne font-bold uppercase leading-snug tracking-[0.12em] text-atrament-sciszony">
                {g.etykieta}
              </p>
              <p className="mt-2.5 flex flex-wrap gap-1.5">
                {g.litery.map((l) => (
                  <span
                    key={l}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-panel font-boksowy text-male font-bold text-atrament"
                  >
                    {l}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {s.czegoNieBrac.length > 0 ? (
        <Karta klasa="mt-4">
          <h3 className="text-naglowek-maly font-extrabold text-atrament">Czego nie brać</h3>
          <p className="mt-1.5 max-w-czytelna text-male text-atrament-sciszony">
            {TEKSTY_KONCOWE.czegoNieBrac}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {s.czegoNieBrac.map((p) => (
              <li key={p.co} className="rounded-lg border border-linia bg-plyta px-3.5 py-2.5">
                <span className="text-tresc font-semibold text-kasowanie">{p.co}</span>
                <span className="mt-0.5 block text-male text-atrament-sciszony">{p.dlaczego}</span>
              </li>
            ))}
          </ul>
        </Karta>
      ) : null}

      {s.jednaDecyzja ? (
        <Karta klasa="mt-3 bg-akcent-tlo/60">
          <Nadpis>Jedna decyzja zamiast ośmiu</Nadpis>
          <p className="mt-2 text-tresc leading-snug text-atrament">{s.jednaDecyzja}</p>
        </Karta>
      ) : null}
    </>
  );
}

/* ================================================================== */
/* 09 CO DALEJ                                                         */
/* ================================================================== */

function PoleSesji({ tytul, podpis, tresc }: { tytul: string; podpis: string; tresc: string | null }) {
  return (
    <div className="rounded-karta border border-linia bg-panel p-5">
      <p className="text-tresc font-bold text-atrament">{tytul}</p>
      <p className="mt-0.5 text-male text-atrament-slaby">{podpis}</p>
      {tresc ? (
        <p className="mt-3 text-tresc leading-relaxed text-atrament-sciszony">{tresc}</p>
      ) : (
        <div aria-hidden className="mt-4 flex flex-col gap-3.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="block h-px bg-linia" />
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
      <div className="proza mb-4 max-w-czytelna">
        {TEKSTY_KONCOWE.coDalej.map((z) => (
          <p key={z}>{z}</p>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <PoleSesji
          tytul="① Moja decyzja"
          podpis="co wybieram i dlaczego"
          tresc={raport.moja_decyzja?.tresc ?? null}
        />
        <PoleSesji
          tytul="② Pierwszy krok"
          podpis="jedna rzecz: co, kiedy, za ile"
          tresc={kroki.length > 0 ? kroki.join(" · ") : null}
        />
        <PoleSesji
          tytul="③ Notatka prowadzącego"
          podpis="co warto zapamiętać"
          tresc={raport.notatka?.tresc ?? null}
        />
      </div>

      <Karta klasa="mt-4">
        <Nadpis>Jedno pytanie na rozmowę</Nadpis>
        <p className="mt-2 max-w-czytelna text-tresc text-atrament-sciszony">
          {TEKSTY_KONCOWE.jednoPytanie}
        </p>
        <label className="mt-3 block">
          <span className="sr-only">Twoje pytanie na rozmowę</span>
          <textarea
            id="pytanie-na-rozmowe"
            value={pytanie}
            onChange={(e) => zapiszPytanie(e.target.value)}
            rows={3}
            placeholder="Na co ten raport nie odpowiedział?"
            className="w-full rounded-xl border border-linia bg-plyta px-4 py-3 text-tresc text-atrament placeholder:text-atrament-slaby focus:border-akcent focus:outline-none"
          />
        </label>
      </Karta>
    </>
  );
}

function NaKoniec() {
  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-3">
      {TEKSTY_KONCOWE.naKoniec.map((p) => (
        <div key={p.tytul} className="rounded-karta border border-linia bg-panel p-5">
          <p className="text-tresc font-bold text-atrament">{p.tytul}</p>
          <p className="mt-1.5 text-male leading-snug text-atrament-sciszony">{p.tresc}</p>
        </div>
      ))}
    </section>
  );
}
