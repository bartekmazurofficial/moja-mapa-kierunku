import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzPostepModulow, pobierzUczestnika } from "@/lib/moduly/serwer";
import { stanDostepu } from "@/lib/raport/dostep";
import { NAZWY_MODULOW } from "@/lib/moduly/ekrany";
import { stanAssessmentu, type StanEtapu } from "@/lib/moduly/etapy";
import { KROTKO, PO_CO } from "@/lib/moduly/opisy";
import { Bramy } from "@/components/pulpit/Bramy";
import { ZnakModulu } from "@/components/pulpit/ZnakModulu";
import { Panorama } from "@/components/pulpit/Panorama";
import type { KodModulu } from "@/lib/moduly/typy";

export const dynamic = "force-dynamic";

/**
 * Strona główna uczestnika: gdzie jestem i co jest dalej.
 *
 * Assessment jest **jedną rzeczą do zrobienia**, a nie spisem czterech zadań.
 * Dlatego cały ekran prowadzi do jednego przycisku, a cztery etapy stoją pod
 * nim jako mapa drogi, nie jako menu do wybierania. Osobna zakładka „Moduły"
 * zniknęła: powtarzała te same cztery nazwy i kazała kliknąć o jeden ekran
 * więcej, zanim dało się zacząć.
 *
 * Czego tu nie ma i być nie może: wyniku przed spotkaniem. Kafelek „co już
 * wiesz" pokazuje wyłącznie to, co prowadzący odsłonił.
 */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const uczestnik = await pobierzUczestnika(kod);
  if (!uczestnik) notFound();

  const [{ zakonczone, odpowiedziWModule }, dostep] = await Promise.all([
    pobierzPostepModulow(uczestnik.id),
    stanDostepu(uczestnik.id, uczestnik.grupaId),
  ]);

  const stan = stanAssessmentu(zakonczone, odpowiedziWModule);
  const procent = Math.round((stan.ukonczonych / stan.etapy.length) * 100);
  const biezacy = stan.etapy.find((e) => e.kod === stan.biezacy);
  const zawodyOtwarte = dostep.dostepne.has("zawody");

  return (
    <div className="flex flex-col gap-3">
      {/* NAGŁÓWEK: powitanie i jeden przycisk. Wszystko inne jest pod nim. */}
      <header className="szklo relative overflow-hidden p-5 sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-akcent/20 blur-3xl"
        />
        <Bramy klasa="pointer-events-none absolute -right-6 bottom-0 hidden h-[13rem] w-[20rem] opacity-70 xl:block" />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="text-drobne uppercase tracking-[0.18em] text-atrament-slaby">
              Twój assessment
            </p>
            <h1 className="mt-2 text-naglowek-maly font-extrabold leading-[1.1] tracking-tight sm:text-naglowek 2xl:text-naglowek-duzy">
              Cześć, {uczestnik.imie}.
              <br />
              <span className="gradient-tytul">
                {stan.gotowy
                  ? "Masz to za sobą."
                  : stan.rozpoczety
                    ? "Zostało jeszcze trochę."
                    : "Zacznijmy od tego, co Cię ciekawi."}
              </span>
            </h1>
            <p className="mt-2 max-w-czytelna text-male leading-relaxed text-atrament-sciszony">
              {stan.gotowy
                ? "Wszystkie cztery etapy są wypełnione. Twój raport jest gotowy do czytania."
                : "Jeden assessment, cztery etapy. Możesz przerwać w dowolnym momencie i wrócić w to samo miejsce."}
            </p>

            <Link
              href={stan.gotowy ? `/u/${kod}/raport` : `/u/${kod}/assessment`}
              className="przejscie przycisk-gradient mt-5 inline-flex min-h-[3.25rem] items-center gap-3 rounded-2xl px-7 text-tresc font-bold"
            >
              {stan.gotowy
                ? "Zobacz swój raport"
                : stan.rozpoczety
                  ? `Wróć do assessmentu: etap ${biezacy?.numer ?? 1}`
                  : "Zacznij assessment"}
              <span aria-hidden>→</span>
            </Link>

            {!stan.gotowy && biezacy ? (
              <p className="mt-2.5 text-drobne text-atrament-slaby">
                Następny etap: {biezacy.nazwa}. {PO_CO[biezacy.kod]}
              </p>
            ) : null}
          </div>

          <div className="relative flex flex-col gap-3">
            <div className="rounded-2xl border border-linia bg-panel/80 p-4">
              <p className="text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
                Twój postęp
              </p>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-naglowek-duzy font-extrabold leading-none tabular-nums">
                  {stan.ukonczonych}
                  <span className="text-naglowek-maly text-atrament-slaby">
                    {" "}
                    z {stan.etapy.length}
                  </span>
                </p>
                <p className="text-male text-atrament-sciszony">
                  etapów wypełnionych
                  <span className="ml-2 text-drobne text-atrament-slaby">{procent}%</span>
                </p>
              </div>
              {/* Przystanki zamiast paska: widać, ile zostało, a nie ułamek. */}
              <ol className="mt-3 flex items-center gap-1.5">
                {stan.etapy.map((e) => (
                  <li key={e.kod} className="flex-1">
                    <span className="sr-only">
                      {e.nazwa}: {OPIS_STANU[e.stan]}
                    </span>
                    <span
                      aria-hidden
                      className={`block h-2 rounded-full ${
                        e.stan === "gotowy"
                          ? "bg-gradient-to-r from-akcent-ciemny to-akcent"
                          : e.stan === "wtrakcie"
                            ? "bg-akcent/45"
                            : "bg-linia"
                      }`}
                    />
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-akcent/20 bg-akcent-tlo/60 px-4 py-3">
              <span aria-hidden className="text-naglowek font-extrabold leading-none text-akcent/40">
                „
              </span>
              <p className="text-tresc font-semibold leading-snug text-atrament">
                Nie musisz znać całej drogi. Wystarczy, że zrobisz kolejny krok.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* CZTERY ETAPY: mapa drogi, nie menu. */}
      <section>
        <h2 className="mb-2 px-1 text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
          Cztery etapy, po kolei
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stan.etapy.map((e) => (
            <li key={e.kod}>
              <KafelekEtapu kod={kod} etap={e} biezacy={e.kod === stan.biezacy} />
            </li>
          ))}
        </ol>
      </section>

      {/* CO JUŻ WIDAĆ */}
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.8fr]">
        <section className="szklo p-5">
          <h2 className="flex items-center gap-3 text-naglowek-maly font-bold">
            <span aria-hidden className="znak-sekcji bg-akcent-tlo text-akcent-jasny">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 12.5 5 5L20 6.5" />
              </svg>
            </span>
            Co już o sobie wiesz
          </h2>
          {stan.rozpoczety ? (
            <>
              <ul className="mt-3 flex flex-col gap-1.5">
                {stan.etapy
                  .filter((e) => e.stan === "gotowy")
                  .map((e) => (
                    <li key={e.kod} className="flex items-start gap-3">
                      <Ptaszek />
                      <span className="text-male leading-relaxed text-atrament-sciszony">
                        {e.nazwa}
                      </span>
                    </li>
                  ))}
                {stan.ukonczonych === 0 ? (
                  <li className="text-male text-atrament-sciszony">
                    Pierwszy etap jest zaczęty. Raport zapełni się, kiedy go domkniesz.
                  </li>
                ) : null}
              </ul>
              <Link
                href={`/u/${kod}/raport`}
                className="przejscie przycisk-pigulka mt-4 inline-flex min-h-10 items-center gap-2 rounded-2xl px-5 text-male font-semibold"
              >
                Otwórz raport <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <p className="proza mt-4">
              Raport zapełnia się sam, w miarę jak wypełniasz etapy. Po pierwszym zobaczysz w nim
              swoją piątkę tematów.
            </p>
          )}
        </section>

        <section className="szklo p-5">
          <h2 className="flex items-center gap-3 text-naglowek-maly font-bold">
            <span aria-hidden className="znak-sekcji" style={{ background: "#f2ecff", color: "#5b21b6" }}>
              <svg viewBox="0 0 16 16" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3.2" y="7" width="9.6" height="6.6" rx="1.4" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
            </span>
            Co jeszcze odkryjesz
          </h2>
          {zawodyOtwarte ? (
            <>
              <p className="proza mt-3">
                Zawody są już odsłonięte. Znajdziesz je na końcu raportu i w kartach zawodów.
              </p>
              <Link
                href={`/u/${kod}/zawody`}
                className="przejscie przycisk-pigulka mt-4 inline-flex min-h-10 items-center gap-2 rounded-2xl px-5 text-male font-semibold"
              >
                Karty zawodów <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <p className="proza mt-3">
              Konkretne zawody odsłania prowadzący na spotkaniu, po omówieniu obszarów. To nie jest
              opóźnienie, tylko kolejność: konkretny zawód czyta się zupełnie inaczej, kiedy
              wiadomo już, z czego wyszedł.
            </p>
          )}
        </section>

        <section className="szklo relative isolate overflow-hidden p-5">
          {/* Ilustracja stoi pod treścią i rozpływa się przy krawędziach,
              więc nigdy nie wchodzi pod zdanie. */}
          <Panorama klasa="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 w-full" moc={0.6} />
          <h2 className="text-naglowek-maly font-bold leading-tight">
            Ta podróż
            <br />
            ma sens.
          </h2>
          <p className="mt-3 max-w-[14rem] text-male leading-relaxed text-atrament-sciszony">
            {stan.gotowy
              ? "Odpowiedzi są zapisane. Reszta zależy od Ciebie."
              : "Nikt tego za Ciebie nie wypełni i nikt nie sprawdzi, czy odpowiedziałeś dobrze."}
          </p>
        </section>
      </div>
    </div>
  );
}

const OPIS_STANU: Record<StanEtapu["stan"], string> = {
  gotowy: "wypełniony",
  wtrakcie: "zaczęty",
  przed: "do zrobienia",
};

/**
 * Kafelek etapu.
 *
 * Wypełniony prowadzi do własnych odpowiedzi, bieżący i przyszły w sam
 * assessment. Żaden nie jest zamknięty: kolejność pilnuje sam przebieg,
 * a uczestnik, który klika w etap czwarty przed drugim, i tak trafia tam,
 * gdzie skończył.
 */
function KafelekEtapu({
  kod,
  etap,
  biezacy,
}: {
  kod: string;
  etap: StanEtapu;
  biezacy: boolean;
}) {
  return (
    <Link
      href={etap.stan === "gotowy" ? `/u/${kod}/wyniki/${etap.kod}` : `/u/${kod}/assessment`}
      className={`przejscie szklo block h-full p-4 ${
        biezacy ? "szklo-akcent" : "hover:border-akcent/45"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-male font-bold tabular-nums text-atrament-slaby">
          Etap {etap.numer}
        </span>
        <Odznaka stan={etap.stan} />
      </div>
      <span className="mt-3 block text-akcent-jasny">
        <ZnakModulu modul={etap.kod as KodModulu} rozmiar={26} />
      </span>
      <span className="mt-2 block text-tresc font-bold leading-snug text-atrament">
        {NAZWY_MODULOW[etap.kod]}
      </span>
      <span className="mt-1 block text-drobne leading-snug text-atrament-slaby">
        {KROTKO[etap.kod]}
      </span>
      {etap.stan === "wtrakcie" ? (
        <span className="mt-2 block text-drobne font-semibold text-akcent-jasny">
          {etap.domkniete} z {etap.wszystkich} części
        </span>
      ) : null}
    </Link>
  );
}

function Odznaka({ stan }: { stan: StanEtapu["stan"] }) {
  const styl: Record<StanEtapu["stan"], string> = {
    gotowy: "border-akcent/40 bg-akcent-tlo text-akcent-jasny",
    wtrakcie: "border-uwaga/40 bg-uwaga-tlo text-uwaga",
    przed: "border-linia-mocna text-atrament-sciszony",
  };
  const tekst: Record<StanEtapu["stan"], string> = {
    gotowy: "wypełniony",
    wtrakcie: "w trakcie",
    przed: "do zrobienia",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold ${styl[stan]}`}
    >
      {tekst[stan]}
    </span>
  );
}

function Ptaszek() {
  return (
    <span
      aria-hidden
      className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-akcent text-na-akcencie"
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M2 6.3 4.6 9 10 3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
