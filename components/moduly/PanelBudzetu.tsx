"use client";

/**
 * PANEL POZIOMU ZYCIA.
 *
 * Dziesiec decyzji, karta pozycji automatycznych i lista pozycji
 * opcjonalnych, a nad tym suma, ktora zmienia sie przy kazdym dotknieciu.
 *
 * Suma na gorze jest calym pomyslem tego ekranu. Pytanie „ile chcesz
 * zarabiac" nie dziala, bo prawie kazdy odpowiada „duzo" albo „nie wiem".
 * Pytanie „jak chcesz mieszkac" dziala, bo na to kazdy ma zdanie. Kwota
 * wychodzi z odpowiedzi sama i dlatego jest wiarygodna takze dla tego, kto ja
 * podal.
 *
 * Trzy rzeczy pilnowane tu swiadomie:
 *
 *   1. **Kazda kategoria ma juz wybrany prog.** Panel wolno przejsc bez
 *      jednej zmiany i to jest pelna odpowiedz. Puste pola zmusilyby
 *      siedemnastolatka do zgadywania, ile kosztuje wynajem.
 *   2. **Karty sa zwiniete.** Dziesiec kategorii po piec progow to
 *      piecdziesiat akapitow naraz. Zwiniete karta mowi trzy rzeczy: co to
 *      jest, co wybrano, ile to kosztuje.
 *   3. **Kwota progu jest widoczna przed wyborem.** Ukrywanie ceny do
 *      momentu kliknięcia robilby z panelu quiz, a to ma byc kalkulator.
 */

import { useMemo, useState } from "react";
import {
  INSTRUKCJA_POZIOMU_ZYCIA,
  KATEGORIE_AKTYWNE,
  POZYCJE_AUTO,
  POZYCJE_OPCJONALNE,
} from "@/lib/content/poziom-zycia";
import { kwotaProgu, policzBudzet, type OdpowiedziBudzetu } from "@/lib/engine/budzet";
import { zl } from "@/lib/ui/kwota";
import type { WlasciwosciPozycji } from "@/components/Pozycja";


interface Stan {
  decyzje: Record<string, string>;
  opcjonalne: Record<string, number>;
}

function odczytaj(wartosc: unknown): Stan {
  const w = (wartosc ?? {}) as Partial<Stan>;
  return { decyzje: w.decyzje ?? {}, opcjonalne: w.opcjonalne ?? {} };
}

export function PanelBudzetu({ pozycja, wartosc, naZmiane }: WlasciwosciPozycji) {
  const stan = odczytaj(wartosc);
  const [otwarta, ustawOtwarta] = useState<string | null>(null);

  const odpowiedzi: OdpowiedziBudzetu = useMemo(
    () => ({
      wejscie: pozycja.wejscieBudzetu ?? {},
      decyzje: stan.decyzje,
      opcjonalne: stan.opcjonalne,
    }),
    [pozycja.wejscieBudzetu, stan.decyzje, stan.opcjonalne],
  );
  const wynik = useMemo(() => policzBudzet(odpowiedzi), [odpowiedzi]);

  const ustawProg = (kategoria: string, prog: string) => {
    naZmiane({ ...stan, decyzje: { ...stan.decyzje, [kategoria]: prog } });
    ustawOtwarta(null);
  };

  const przelaczOpcjonalna = (kod: string, sugestia: number) => {
    const nowe = { ...stan.opcjonalne };
    if (nowe[kod]) delete nowe[kod];
    else nowe[kod] = sugestia;
    naZmiane({ ...stan, opcjonalne: nowe });
  };

  const domyslny = (kod: string) => {
    const k = KATEGORIE_AKTYWNE.find((x) => x.kod === kod)!;
    return (k.progi.find((p) => p.domyslny) ?? k.progi[0]).kod;
  };

  return (
    <div>
      {/* Suma przyklejona do gory. To jedyna liczba, ktora ten ekran niesie. */}
      <div className="sticky top-0 z-10 -mx-1 mb-6 rounded-xl border-2 border-akcent bg-akcent-tlo px-4 py-4">
        {/*
          Nie powtarzamy tu naglowka ekranu: stoi kilkanascie pikseli wyzej
          i powtorzony czyta sie jak blad szablonu. Pasek ma niesc liczbe.
        */}
        <p className="text-drobne font-semibold uppercase tracking-wide text-atrament-sciszony">
          Tyle kosztuje to, co ustawiłeś
        </p>
        <p className="mt-1 text-naglowek font-extrabold tracking-tight text-atrament">
          {zl(wynik.komfort)}
          <span className="ml-2 text-male font-medium text-atrament-sciszony">na miesiąc</span>
        </p>
        <p className="mt-1 text-drobne text-atrament-sciszony">
          {wynik.zmienione === 0
            ? "Wszystko jest ustawione na wartościach domyślnych. Możesz nic nie zmieniać."
            : `Zmieniono ${wynik.zmienione} z ${KATEGORIE_AKTYWNE.length} kategorii.`}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {KATEGORIE_AKTYWNE.map((k) => {
          const wybrany = stan.decyzje[k.kod] ?? domyslny(k.kod);
          const prog = k.progi.find((p) => p.kod === wybrany) ?? k.progi[0];
          const rozwinieta = otwarta === k.kod;
          const skladnik = wynik.skladniki.find((s) => s.kod === k.kod);
          return (
            <li key={k.kod} className="overflow-hidden rounded-xl border-2 border-linia-mocna bg-panel">
              <button
                type="button"
                aria-expanded={rozwinieta}
                onClick={() => ustawOtwarta(rozwinieta ? null : k.kod)}
                className="przejscie flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left hover:bg-plyta"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-male font-semibold text-atrament">{k.nazwa}</span>
                  <span className="block text-drobne text-atrament-sciszony">{prog.nazwa}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-male font-bold tabular-nums text-atrament">
                    {zl(skladnik?.kwota ?? prog.kwota)}
                  </span>
                  <span className="block text-drobne text-atrament-sciszony">
                    {rozwinieta ? "zwiń" : "zmień"}
                  </span>
                </span>
              </button>

              {rozwinieta ? (
                <div className="border-t-2 border-linia px-4 py-3">
                  <p className="text-drobne text-atrament-sciszony">{k.podpis}</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {k.progi.map((p) => {
                      const ten = p.kod === wybrany;
                      return (
                        <li key={p.kod}>
                          <button
                            type="button"
                            aria-pressed={ten}
                            onClick={() => ustawProg(k.kod, p.kod)}
                            className={`przejscie flex min-h-14 w-full items-start gap-3 rounded-lg border-2 px-3 py-2.5 text-left ${
                              ten
                                ? "border-akcent bg-akcent-tlo"
                                : "border-linia bg-panel hover:border-linia-mocna"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                ten ? "border-akcent bg-akcent" : "border-linia-mocna"
                              }`}
                            >
                              {ten ? <span className="size-2 rounded-full bg-na-akcencie" /> : null}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-male font-medium text-atrament">{p.nazwa}</span>
                              <span className="block text-drobne text-atrament-sciszony">{p.opis}</span>
                            </span>
                            <span className="shrink-0 text-male font-semibold tabular-nums text-atrament">
                              {zl(kwotaProgu(k, p.kod, odpowiedzi))}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}

        {/* Karta pozycji automatycznych. Do obejrzenia, nie do zmiany. */}
        <li className="overflow-hidden rounded-xl border-2 border-dashed border-linia-mocna bg-plyta">
          <button
            type="button"
            aria-expanded={otwarta === "auto"}
            onClick={() => ustawOtwarta(otwarta === "auto" ? null : "auto")}
            className="przejscie flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-male font-semibold text-atrament">
                {INSTRUKCJA_POZIOMU_ZYCIA.kartaAuto.nazwa}
              </span>
              <span className="block text-drobne text-atrament-sciszony">
                {INSTRUKCJA_POZIOMU_ZYCIA.kartaAuto.podpis}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-male font-bold tabular-nums text-atrament">
                {zl(wynik.skladniki.find((s) => s.kod === "auto")?.kwota ?? 0)}
              </span>
              <span className="block text-drobne text-atrament-sciszony">
                {otwarta === "auto" ? "zwiń" : "zobacz"}
              </span>
            </span>
          </button>
          {otwarta === "auto" ? (
            <div className="border-t-2 border-linia px-4 py-3">
              <p className="text-drobne text-atrament-sciszony">
                {INSTRUKCJA_POZIOMU_ZYCIA.kartaAuto.opis}
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                {POZYCJE_AUTO.map((p) => (
                  <li
                    key={p.kod}
                    className="flex justify-between gap-3 border-b border-linia py-1 text-drobne text-atrament-sciszony"
                  >
                    <span>{p.nazwa}</span>
                    <span className="tabular-nums">{zl(p.kwota)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      </ul>

      {/* Pozycje opcjonalne. Domyslnie zero, wlaczane jednym dotknieciem. */}
      <div className="mt-8">
        <h3 className="text-naglowek-maly font-bold tracking-tight text-atrament">
          Czy coś z tego dotyczy Ciebie?
        </h3>
        <p className="mt-1 text-male text-atrament-sciszony">
          Domyślnie nic z tej listy nie jest doliczone. Włącz tylko to, co naprawdę planujesz.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {POZYCJE_OPCJONALNE.map((p) => {
            const wlaczona = Boolean(stan.opcjonalne[p.kod]);
            return (
              <li key={p.kod}>
                <button
                  type="button"
                  aria-pressed={wlaczona}
                  onClick={() => przelaczOpcjonalna(p.kod, p.sugestia)}
                  className={`przejscie flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-male ${
                    wlaczona
                      ? "border-akcent bg-akcent-tlo font-semibold text-atrament"
                      : "border-linia-mocna bg-panel text-atrament hover:border-atrament-sciszony"
                  }`}
                >
                  <span>{p.nazwa}</span>
                  <span className="shrink-0 tabular-nums text-drobne text-atrament-sciszony">
                    {wlaczona ? zl(p.sugestia) : "+"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
