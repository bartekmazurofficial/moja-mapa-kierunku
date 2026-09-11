"use client";

/**
 * Renderery sekcji raportu.
 *
 * Trzy zasady, ktore te komponenty maja utrzymac:
 *   - nigdzie nie pojawia sie liczba dopasowania, tylko pasmo opisowe,
 *   - kolor nigdy nie jest jedynym nosnikiem informacji: kazda flaga ma etykiete,
 *   - nic nie brzmi jak wyrok.
 */

import Link from "next/link";
import type { Raport } from "@/lib/raport/typy";

export function Naglowek({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-drobne uppercase tracking-[0.08em] text-atrament-slaby">{children}</p>;
}

export function Lista({ pozycje }: { pozycje: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {pozycje.map((p, i) => (
        <li key={i} className="flex gap-2.5 text-tresc leading-relaxed">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-linia-mocna" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

export function Pasmo({ opis }: { pasmo?: string; opis: string }) {
  // Pasmo bez opisu nie ma czego pokazac. Wczesniej wypadal tu kod techniczny
  // („ponizej_progu", „antydopasowanie") i trafial wprost na ekran uczestnika.
  if (!opis) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-akcent-tlo px-2.5 py-0.5 text-drobne text-akcent">
      {opis}
    </span>
  );
}

const STYLE_FLAG: Record<string, string> = {
  trampolina: "bg-trampolina-tlo text-trampolina",
  koszt: "bg-koszt-tlo text-koszt",
  zagrozony: "bg-przyszlosc-tlo text-przyszlosc",
  uwaga: "bg-uwaga-tlo text-uwaga",
};

export function Flaga({ rodzaj, children }: { rodzaj: keyof typeof STYLE_FLAG; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-drobne ${STYLE_FLAG[rodzaj]}`}>
      {children}
    </span>
  );
}

// =====================================================================

export function PunktStartu({ dane }: { dane: NonNullable<Raport["punkt_startu"]> }) {
  return (
    <div className="flex flex-col gap-5">
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
        <dt className="text-male text-atrament-slaby">Gdzie jesteś</dt>
        <dd className="text-tresc">{dane.gdzieJestes}</dd>
        <dt className="text-male text-atrament-slaby">Co Ci idzie</dt>
        <dd className="text-tresc">{dane.coCiIdzie.join(", ")}</dd>
        {dane.coJuzRobiles.length > 0 ? (
          <>
            <dt className="text-male text-atrament-slaby">Co już robiłeś</dt>
            <dd className="text-tresc">{dane.coJuzRobiles.join(", ")}</dd>
          </>
        ) : null}
        <dt className="text-male text-atrament-slaby">Skąd startujesz</dt>
        <dd className="text-tresc">{dane.skadStartujesz}</dd>
      </dl>
      <div>
        <Naglowek>Co to otwiera</Naglowek>
        <Lista pozycje={dane.coToOtwiera} />
      </div>
      {dane.oCzymWartoWiedziec.length > 0 ? (
        <div>
          <Naglowek>O czym warto wiedzieć</Naglowek>
          <Lista pozycje={dane.oCzymWartoWiedziec} />
        </div>
      ) : null}
    </div>
  );
}

export function CoMnieInteresuje({ dane }: { dane: NonNullable<Raport["co_mnie_interesuje"]> }) {
  return (
    <div className="flex flex-col gap-7">
      <p className="text-tresc-duza font-semibold leading-relaxed">{dane.zdanie}</p>
      {dane.gora.length > 0 ? (
        <ol className="flex flex-col gap-5">
          {dane.gora.map((p) => (
            <li key={p.tytul} className="border-l-2 border-akcent/30 pl-4">
              <p className="text-tresc-duza">{p.tytul}</p>
              <p className="mt-1 text-tresc leading-relaxed text-atrament-sciszony">{p.opis}</p>
              <p className="mt-1.5 text-male text-atrament-sciszony">
                <span className="text-atrament-slaby">Co to zmienia: </span>
                {p.coZmienia}
              </p>
              {p.nieProbowal ? (
                <p className="mt-1 text-drobne text-atrament-slaby">Tego jeszcze nie próbowałeś.</p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
      {dane.dol.length > 0 ? (
        <div>
          <Naglowek>Mniej Cię ciągnie</Naglowek>
          <Lista pozycje={dane.dol.map((p) => p.opis ?? p.tytul)} />
        </div>
      ) : null}
      <p className="text-male text-atrament-sciszony">{dane.osie}</p>
    </div>
  );
}

export function JakDzialam({ dane }: { dane: NonNullable<Raport["jak_dzialam"]> }) {
  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-3.5">
        {dane.osie.map((o) => (
          <li key={o.kod} className={o.wyrazista ? "" : "opacity-55"}>
            <div className="flex items-baseline justify-between gap-3 text-drobne text-atrament-slaby">
              <span>{o.biegunA}</span>
              <span>{o.biegunB}</span>
            </div>
            <div className="relative mt-1 h-1.5 rounded-full bg-tlo/50" aria-hidden>
              <span
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-akcent"
                style={{ left: `${100 - o.polozenie}%` }}
              />
            </div>
            <p className="mt-1.5 text-male">{o.opis}</p>
          </li>
        ))}
      </ul>
      <p className="text-male text-atrament-sciszony">{dane.zdanie}</p>
    </div>
  );
}

export function WCzymDobry({ dane }: { dane: NonNullable<Raport["w_czym_dobry"]> }) {
  return (
    <div className="flex flex-col gap-7">
      <p className="text-tresc-duza font-semibold leading-relaxed">{dane.zdanie}</p>
      <ol className="flex flex-col gap-4">
        {dane.mocne.map((p) => (
          <li key={p.tytul} className="border-l-2 border-akcent/30 pl-4">
            <p className="text-tresc-duza">{p.tytul}</p>
            <p className="mt-0.5 text-tresc leading-relaxed text-atrament-sciszony">{p.opis}</p>
            {p.dopisek ? <p className="mt-1 text-drobne text-atrament-slaby">{p.dopisek}</p> : null}
          </li>
        ))}
      </ol>
      <div>
        <Naglowek>Słabsze strony</Naglowek>
        <Lista pozycje={dane.slabsze.map((p) => p.tytul)} />
        <p className="mt-3 text-tresc leading-relaxed text-atrament-sciszony">{dane.ramka}</p>
      </div>
    </div>
  );
}

export function LubieAWychodzi({ dane }: { dane: NonNullable<Raport["lubie_a_wychodzi"]> }) {
  const cwiartka = (tytul: string, pozycje: { tytul: string }[], komunikat: string) =>
    pozycje.length === 0 ? null : (
      <div key={tytul} className="szklo p-5">
        <p className="text-tresc-duza">{tytul}</p>
        <p className="mt-1  text-male leading-relaxed text-atrament-sciszony">{komunikat}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {pozycje.map((p) => (
            <li key={p.tytul} className="rounded bg-tlo/50 px-2 py-1 text-drobne">
              {p.tytul}
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      {cwiartka("Mocna droga", dane.mocneDrogi, dane.komunikaty["mocna_droga"])}
      {cwiartka("Ukryty atut", dane.ukryteAtuty, dane.komunikaty["ukryty_atut"])}
      {cwiartka("Chcę, ale muszę zbudować", dane.doZbudowania, dane.komunikaty["do_zbudowania"])}
    </div>
  );
}

export function Wartosci({ dane }: { dane: NonNullable<Raport["wartosci"]> }) {
  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col gap-3">
        {dane.gora.map((w) => (
          <li key={w.tytul}>
            <p className="text-tresc-duza">
              {w.tytul}
              {w.dopisek ? (
                <span className="ml-2 align-middle">
                  <Flaga rodzaj="uwaga">{w.dopisek}</Flaga>
                </span>
              ) : null}
            </p>
            <p className="text-tresc text-atrament-sciszony">{w.opis}</p>
          </li>
        ))}
      </ol>
      <div>
        <Naglowek>Z czego jesteś gotów zrezygnować</Naglowek>
        <Lista pozycje={dane.dol.map((w) => w.tytul)} />
      </div>
      <p className="text-tresc leading-relaxed text-atrament-sciszony">{dane.testKosztu}</p>
    </div>
  );
}

export function WizjaZycia({ dane }: { dane: NonNullable<Raport["wizja_zycia"]> }) {
  if (dane.obszary.length === 0) {
    return <p className="text-male text-atrament-slaby">Ta część jeszcze czeka na Twoje słowa.</p>;
  }
  return (
    <div className="flex flex-col gap-6">
      {dane.obszary.map((o) => (
        <div key={o.tytul}>
          <Naglowek>{o.tytul}</Naglowek>
          {/* Cytowane doslownie, bez skracania i bez interpretacji. */}
          {o.tresc.map((t, i) => (
            <p key={i} className="text-tresc leading-relaxed">
              {t}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TrzyDrogi({ dane }: { dane: NonNullable<Raport["trzy_drogi"]> }) {
  const ROLE: Record<string, string> = {
    A: "Tu pasujesz najmocniej",
    B: "Tu też pasujesz, ale to inna praca",
    C: "Coś zupełnie innego",
  };
  return (
    <div className="flex flex-col gap-5">
      <p className="text-tresc leading-relaxed text-atrament-sciszony">
        {dane.drogi.some((d) => d.tenSamObszar)
          ? "Trzy drogi, nie jedna rekomendacja. Dwie pierwsze wyszły z Twoich odpowiedzi najmocniej, trzecia prowadzi do tej samej dziedziny innym, krótszym wejściem."
          : "Trzy drogi, nie jedna rekomendacja. Dwie wyszły z Twoich odpowiedzi najmocniej, trzecia jest tu po to, żeby była od nich naprawdę inna i żebyś miał je z czym porównać."}
      </p>
      {/* Trzy rowne kolumny, identyczne pod kazdym wzgledem poza trescia. */}
      <div className="grid gap-4 lg:grid-cols-3">
        {dane.drogi.map((d) => (
          <article key={d.etykieta} className="flex flex-col szklo p-5">
            <p className="text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
              {d.tenSamObszar ? "Ta sama dziedzina, inne wejście" : ROLE[d.etykieta]}
            </p>
            <h3 className="mt-1.5 text-naglowek-maly font-bold leading-snug">{d.obszar}</h3>
            <p className="mt-2 text-male text-atrament-sciszony">
              {d.przyklad} · {d.czas}
            </p>
            {d.zawody.length > 0 ? (
              <div className="mt-4">
                <Naglowek>Zawody</Naglowek>
                <p className="text-male">{d.zawody.map((z) => z.nazwa).join(" · ")}</p>
              </div>
            ) : null}
            {d.kierunki.length > 0 ? (
              <div className="mt-3">
                <Naglowek>Kierunki</Naglowek>
                <p className="text-male">{d.kierunki.join(" · ")}</p>
              </div>
            ) : null}
            {d.umiejetnosci.length > 0 ? (
              <div className="mt-3">
                <Naglowek>Do nauczenia się</Naglowek>
                <p className="text-male">{d.umiejetnosci.join(" · ")}</p>
              </div>
            ) : null}
            {/* Bez tego zdania trzecia droga wyglada na nagrode pocieszenia. */}
            {d.etykieta === "C" ? (
              <p className="mt-4 text-male text-atrament-sciszony">
                {d.tenSamObszar
                  ? "Te same drzwi, inny próg. Zaczynasz szybciej i sprawdzasz w praktyce, czy ta dziedzina jest Twoja, zanim zainwestujesz w dłuższą drogę."
                  : "Jest tutaj celowo. Jeśli za dwa lata okaże się, że A i B były pomyłką, to jest miejsce, od którego zaczniesz szukać ponownie."}
              </p>
            ) : null}
          </article>
        ))}
      </div>
      {/* Pierwszy krok wynika z etapu edukacji, nie z drogi. Powtorzony w trzech
          kartach wygladalby na blad szablonu, wiec stoi raz, pod nimi. */}
      <div className="szklo p-5">
        <Naglowek>Pierwszy krok, przy każdej z tych dróg</Naglowek>
        <p className="text-male">{dane.pierwszyKrok}</p>
      </div>
      {dane.kolejnoscOdProwadzacego ? (
        <p className="text-tresc leading-relaxed text-atrament-sciszony">
          Kolejność tych trzech dróg zmienił prowadzący po Waszej rozmowie. To nie jest wynik
          kwestionariusza, tylko wniosek z tego, co powiedziałeś.
        </p>
      ) : null}
      {dane.flagi.map((f, i) => (
        <p key={i} className="text-tresc leading-relaxed text-atrament-sciszony">
          {f}
        </p>
      ))}
    </div>
  );
}

export function Kierunki({ dane }: { dane: NonNullable<Raport["kierunki"]> }) {
  const kierunki = (
    <div>
      <Naglowek>Najbardziej logiczne kierunki</Naglowek>
      <ol className="flex flex-col gap-5">
        {dane.kierunki.map((k) => (
          <li key={k.kod} className="szklo p-5">
            <p className="text-naglowek-maly font-bold leading-snug">{k.nazwa}</p>
            <dl className="mt-3 grid gap-x-5 gap-y-1.5 text-male sm:grid-cols-[auto_1fr]">
              <dt className="text-atrament-slaby">Prowadzi do</dt>
              <dd>{k.prowadziDo.join(", ")}</dd>
              <dt className="text-atrament-slaby">Rekrutacja</dt>
              <dd>{k.rekrutacja}</dd>
              <dt className="text-atrament-slaby">Twoja sytuacja</dt>
              <dd>{k.twojaSytuacja}</dd>
              <dt className="text-atrament-slaby">Co się tam robi</dt>
              <dd>{k.coSieRobi}</dd>
              {k.czegoNieDaje ? (
                <>
                  <dt className="text-atrament-slaby">Czego nie daje</dt>
                  <dd>{k.czegoNieDaje}</dd>
                </>
              ) : null}
            </dl>
            {k.ostrzezenia.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-1.5">
                {k.ostrzezenia.map((o, i) => (
                  <li key={i} className="rounded bg-uwaga-tlo px-3 py-2 text-male text-uwaga">
                    {o}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );

  const drogi = (
    <div>
      <Naglowek>Drogi bez studiów prowadzące do tych samych zawodów</Naglowek>
      <ul className="flex flex-col gap-3">
        {dane.drogiBezStudiow.map((d) => (
          <li key={d.nazwa} className="szklo p-4">
            <p className="text-tresc-duza">{d.nazwa}</p>
            <p className="mt-1 text-male text-atrament-sciszony">
              {d.czas} · {d.koszt}
            </p>
            <p className="mt-1 text-male">Prowadzi do: {d.prowadziDo.join(", ")}</p>
            <p className="mt-1 text-drobne text-atrament-slaby">{d.wymagania}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-akcent/25 bg-akcent-tlo p-5">
        <Naglowek>Czy studia są w Twoim przypadku potrzebne</Naglowek>
        <p className="text-tresc-duza font-semibold leading-relaxed">{dane.komunikat}</p>
      </div>
      {/* Kolejnosc odzwierciedla to, co dla uczestnika realne, a nie hierarchie prestizu. */}
      {dane.drogiBezStudiowPierwsze ? (
        <>
          {drogi}
          {kierunki}
        </>
      ) : (
        <>
          {kierunki}
          {drogi}
        </>
      )}
      <p className="border-t border-linia pt-5 text-tresc leading-relaxed text-atrament-sciszony">
        {dane.kierunekToNieZawod}
      </p>
    </div>
  );
}

export function Obszary({ dane }: { dane: NonNullable<Raport["obszary"]> }) {
  return (
    <div className="flex flex-col gap-5">
      {dane.komunikatNieostry ? (
        <p className="text-tresc leading-relaxed text-atrament-sciszony">
          {dane.komunikatNieostry}
        </p>
      ) : null}
      <ol className="flex flex-col gap-4">
        {dane.pozycje.map((o) => (
          <li key={o.nazwa} className="szklo p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-naglowek-maly font-bold leading-snug">{o.nazwa}</h3>
              <Pasmo pasmo={o.pasmo} opis={o.pasmoOpis} />
            </div>
            <p className="mt-1.5 text-male text-atrament-sciszony">
              Wejście: {o.przyklad} · {o.czas}
            </p>
            {o.dlaczego.length > 0 ? (
              <div className="mt-4">
                <Naglowek>Dlaczego może do Ciebie pasować</Naglowek>
                <Lista pozycje={o.dlaczego} />
              </div>
            ) : null}
            {o.przeszkadza.length > 0 ? (
              <div className="mt-3">
                <Naglowek>Co może Ci przeszkadzać</Naglowek>
                <Lista pozycje={o.przeszkadza} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Zawody({
  dane,
  kodUczestnika,
  oceny,
  naOcene,
}: {
  dane: NonNullable<Raport["zawody"]>;
  kodUczestnika: string;
  oceny: Record<string, string>;
  naOcene: (zawod: string, ocena: string) => void;
}) {
  const OCENY = [
    { kod: "interesuje", etykieta: "Interesuje mnie" },
    { kod: "moze", etykieta: "Może" },
    { kod: "nie_dla_mnie", etykieta: "Nie dla mnie" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <p className="text-tresc leading-relaxed text-atrament-sciszony">
        Przy każdym zawodzie zaznacz, jak go widzisz. Prowadzący zobaczy to przed rozmową. Jeśli
        odrzucasz coś, co wyszło wysoko, tym lepiej. Właśnie o tym będziecie rozmawiać.
      </p>
      {dane.wynikiWstepne ? (
        <p className="rounded bg-uwaga-tlo px-3 py-2 text-male text-uwaga">
          Ta lista jest wstępna: niewiele pozycji przekroczyło próg. Warto ją omówić na rozmowie.
        </p>
      ) : null}
      <ol className="flex flex-col gap-4">
        {dane.pozycje.map((p) => (
          <li key={p.kod} className="szklo p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-naglowek-maly font-bold leading-snug">{p.nazwa}</h3>
              <Pasmo pasmo={p.pasmo} opis={p.pasmoOpis} />
            </div>

            {p.typ === "klaster" ? (
              <div className="mt-3 rounded-xl border border-linia bg-tlo/50 p-4">
                <p className="text-male text-atrament-sciszony">
                  Twoje odpowiedzi nie rozstrzygają między tymi zawodami, bo różnią się rzeczami,
                  których nie da się zmierzyć kwestionariuszem. Przeczytaj obie karty.
                </p>
                <p className="mt-2 text-tresc leading-relaxed">{p.pytanieRozstrzygajace}</p>
                {p.roznica ? (
                  <p className="mt-2 text-male text-atrament-sciszony">{p.roznica}</p>
                ) : null}
                {p.uwaga ? <p className="mt-2 text-male text-atrament-sciszony">{p.uwaga}</p> : null}
              </div>
            ) : null}

            <ul className="mt-4 flex flex-col gap-5">
              {p.zawody.map((z) => (
                <li key={z.kod}>
                  {p.typ === "klaster" ? <p className="text-tresc-duza">{z.nazwa}</p> : null}
                  <ul className="flex flex-col gap-1.5">
                    {z.uzasadnienie.map((u, i) => (
                      <li key={i} className="text-male text-atrament-sciszony">
                        {u}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {z.flagi.trampolina ? (
                      <Flaga rodzaj="trampolina">dobre pierwsze miejsce, warto mieć plan wyjścia</Flaga>
                    ) : null}
                    {z.flagi.zagrozony ? (
                      <Flaga rodzaj="zagrozony">ta część zawodu się kurczy, inna rośnie</Flaga>
                    ) : null}
                    {z.flagi.barieraKosztowa ? (
                      <Flaga rodzaj="koszt">wejście kosztuje, sprawdź dofinansowania</Flaga>
                    ) : null}
                    {z.zGwarancji === "droga_krotsza" ? <Flaga rodzaj="trampolina">droga krótsza</Flaga> : null}
                  </div>
                  {z.flagi.zdanieKierunkowe ? (
                    <p className="mt-2 border-l-2 border-akcent/40 pl-3 text-tresc leading-relaxed">
                      {z.flagi.zdanieKierunkowe}
                    </p>
                  ) : null}
                  {z.ostrzezenia.map((o, i) => (
                    <p key={i} className="mt-2 rounded bg-uwaga-tlo px-3 py-2 text-male text-uwaga">
                      {o}
                    </p>
                  ))}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/u/${kodUczestnika}/zawod/${z.kod}`}
                      className="przejscie min-h-9 rounded-md border border-linia px-3 py-1.5 text-drobne hover:border-linia-mocna"
                    >
                      {z.maPelnaKarte ? "Przeczytaj kartę zawodu" : "Zobacz kartę"}
                    </Link>
                    <div className="flex gap-1.5">
                      {OCENY.map((o) => (
                        <button
                          key={o.kod}
                          type="button"
                          onClick={() => naOcene(z.kod, o.kod)}
                          aria-pressed={oceny[z.kod] === o.kod}
                          className={`przejscie min-h-9 rounded-md border px-3 py-1.5 text-drobne ${
                            oceny[z.kod] === o.kod
                              ? "border-akcent bg-akcent text-na-akcencie"
                              : "border-linia hover:border-linia-mocna"
                          }`}
                        >
                          {o.etykieta}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Korekta prowadzacego stoi osobno i jest podpisana: uczestnik ma
          wiedziec, co powiedzial mu algorytm, a co czlowiek. */}
      {dane.odProwadzacego.length > 0 ? (
        <section className="szklo szklo-akcent p-5">
          <Naglowek>Dopisane podczas rozmowy</Naglowek>
          <p className="text-tresc leading-relaxed">
            To nie wyszło z kwestionariusza. Wskazał to prowadzący podczas Waszej rozmowy.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {dane.odProwadzacego.map((z) => (
              <li key={z.kod}>
                <p className="text-tresc-duza">{z.nazwa}</p>
                {z.uzasadnienie ? (
                  <p className="text-male text-atrament-sciszony">{z.uzasadnienie}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function CzegoUnikac({ dane }: { dane: NonNullable<Raport["czego_unikac"]> }) {
  if (dane.pozycje.length === 0) {
    return <p className="text-male text-atrament-slaby">Nic tu nie wyszło i to też jest informacja.</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {dane.pozycje.map((p) => (
        <li key={p.nazwa}>
          <p className="text-tresc-duza">{p.nazwa}</p>
          <p className="text-tresc leading-relaxed text-atrament-sciszony">{p.komunikat}</p>
        </li>
      ))}
    </ul>
  );
}
