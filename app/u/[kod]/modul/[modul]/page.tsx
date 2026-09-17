import { notFound } from "next/navigation";
import { Runner } from "@/components/Runner";
import { pobierzStanModulu, pobierzUczestnika } from "@/lib/moduly/serwer";
import { KOLEJNOSC_MODULOW, NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { LICZBA_ETAPOW, NAZWY_ETAPOW, nastepnyEtap, numerEtapu } from "@/lib/moduly/etapy";
import { ZAMKNIECIE } from "@/lib/content/wspolne";
import { Ukonczenie } from "@/components/moduly/Ukonczenie";
import type { KodModulu } from "@/lib/moduly/typy";

/** Polska odmiana po liczbie: 1 odpowiedź, 2-4 odpowiedzi, 5 i więcej odpowiedzi. */
function odmiana(ile: number, jeden: string, kilka: string, wiele: string): string {
  const reszta = ile % 10;
  const setka = ile % 100;
  if (ile === 1) return `1 ${jeden}`;
  if (reszta >= 2 && reszta <= 4 && (setka < 12 || setka > 14)) return `${ile} ${kilka}`;
  return `${ile} ${wiele}`;
}

export const dynamic = "force-dynamic";

/**
 * Jeden etap assessmentu.
 *
 * Adres zostaje na etapie, bo po nim wraca przerwany assessment, ale uczestnik
 * nie dobiera sie tu z listy: wchodzi w `/u/<kod>/assessment` i ekran konca
 * etapu przerzuca go w nastepny. Lista modulow, na ktora trzeba bylo wracac po
 * kazdej czesci, zniknela razem z jej wadą: cztery pozycje w spisie tresci
 * czytaly sie jak cztery zadania, a to jest jedno.
 *
 * **Etapy nie sa juz otwierane po jednym.** Wczesniej kazdy czekal na
 * prowadzacego i grupa, ktorej nikt niczego nie otworzyl, widziala cztery
 * zamkniete kafle i nie mogla zaczac. Kolejnosc pilnuje sam assessment:
 * idzie sie przez etapy po kolei, a jedyna rzecza, ktora prowadzacy odslania,
 * sa zawody w raporcie.
 */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; modul: string }>;
}) {
  const { kod, modul } = await params;
  if (!KOLEJNOSC_MODULOW.includes(modul as KodModulu)) notFound();

  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const etap = modul as KodModulu;
  const stan = await pobierzStanModulu(uczestnik.id, etap);

  if (stan.czesc === null || stan.definicja === null) {
    /**
     * Ekran zamykajacy etap. Uczestnik konczy kilkanascie minut pracy i ma
     * dostac moment, a nie jeden akapit. Znaczniki mowia o wykonanej pracy,
     * nigdy o wyniku: ile zawodow sie dopasowalo, odslania prowadzacy na
     * spotkaniu i nic z tego nie ma prawa wyciec wczesniej.
     */
    const odpowiedzi = stan.liczbaOdpowiedzi;
    const nastepny = nastepnyEtap(etap);
    const znaczniki = [
      odpowiedzi > 0 ? odmiana(odpowiedzi, "odpowiedź", "odpowiedzi", "odpowiedzi") : null,
      `etap ${numerEtapu(etap)} z ${LICZBA_ETAPOW}`,
    ].filter((x): x is string => Boolean(x));

    return (
      <Ukonczenie
        kodUczestnika={kod}
        modul={modul}
        nazwaModulu={NAZWY_MODULOW[etap]}
        zamkniecie={ZAMKNIECIE[modul] ?? "Gotowe. Twoje odpowiedzi są zapisane."}
        znaczniki={znaczniki}
        ostatni={nastepny === null}
        dalej={
          nastepny
            ? { href: `/u/${kod}/modul/${nastepny}`, etykieta: `Dalej: ${NAZWY_ETAPOW[nastepny]}` }
            : { href: `/u/${kod}/raport`, etykieta: "Zobacz swój raport" }
        }
      />
    );
  }

  return (
    <Runner
      /**
       * Klucz z części, nie z etapu. Po domknięciu części `router.refresh()`
       * podmienia definicję w locie, a stan komponentu (numer ekranu) zostaje
       * z poprzedniej części. Etap pierwszy ma dwa ekrany, drugi jeden, więc
       * numer wskazywał w pustkę i ekran robił się pusty. Klucz wymusza nowy
       * komponent, czyli numer ekranu od zera.
       */
      key={`${modul}-${stan.czesc}`}
      kodUczestnika={kod}
      modul={etap}
      definicja={stan.definicja}
      zapisane={stan.zapisane}
      nazwaModulu={NAZWY_MODULOW[etap]}
      numerModulu={numerEtapu(etap)}
      liczbaModulow={LICZBA_ETAPOW}
    />
  );
}
