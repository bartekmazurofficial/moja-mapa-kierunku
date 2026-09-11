import Link from "next/link";
import { notFound } from "next/navigation";
import { zalogowany } from "@/lib/prowadzacy/sesja";
import { pobierzKarteUczestnika } from "@/lib/prowadzacy/dane";
import { zapiszSesje } from "@/lib/prowadzacy/akcje";
import { Logowanie } from "@/components/prowadzacy/Logowanie";
import { PRZEBIEG, SYTUACJE_TRUDNE } from "@/lib/panel/przebieg";
import {
  Blok,
  KtoToJest,
  Naglowek,
  Ostrzezenia,
  PytanieUczestnika,
  Rozjazdy,
  TrzyDrogiPanel,
  UsunieteWetem,
  Wizja,
} from "@/components/prowadzacy/Karta";
import { Korekty } from "@/components/prowadzacy/Korekty";
import { Bramy } from "@/components/pulpit/Bramy";

export const dynamic = "force-dynamic";

/** Widok dwukolumnowy, używany na żywo w trakcie rozmowy. */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  if (!(await zalogowany())) return <Logowanie />;
  const { kod } = await params;
  const karta = await pobierzKarteUczestnika(kod);
  if (!karta) notFound();
  const s = karta.sesja;

  return (
    <main className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 py-8 sm:px-8">
      <header className="szklo relative overflow-hidden p-7 lg:pr-[22rem]">
        <Bramy klasa="pointer-events-none absolute -right-10 bottom-0 hidden h-[12rem] w-[19rem] opacity-60 lg:block" />
        <Link
          href={`/prowadzacy/uczestnik/${karta.kodDostepu}`}
          className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Karta uczestnika
        </Link>
        <h1 className="mt-4 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
          Sesja <span aria-hidden className="text-atrament-slaby">·</span>{" "}
          <span className="gradient-tytul">{karta.imie}</span>
        </h1>
        <p className="proza mt-3 max-w-czytelna">
          Sześćdziesiąt minut. To jest spotkanie decyzyjne, nie kolejne spotkanie odkrywania siebie.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* LEWA: przebieg z minutami, pytania, skrypty */}
        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-3">
            {PRZEBIEG.map((e) => (
              <li key={e.minuty} className="szklo p-5">
                <p className="inline-flex rounded-full border border-akcent/35 bg-akcent-tlo px-3 py-0.5 text-drobne font-semibold tracking-[0.08em] text-akcent-jasny">
                  {e.minuty} min
                </p>
                <h2 className="text-naglowek-maly font-bold leading-snug">{e.tytul}</h2>
                {e.cel ? <p className="mt-1 text-male text-atrament-sciszony">{e.cel}</p> : null}
                {e.pytania.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {e.pytania.map((p, i) => (
                      <li key={i} className="text-tresc leading-relaxed">
                        „{p}”
                      </li>
                    ))}
                  </ul>
                ) : null}
                {e.uwagi.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-1 text-male text-atrament-sciszony">
                    {e.uwagi.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>

          <details className="szklo p-5">
            <summary className="cursor-pointer text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
              Sytuacje trudne, siedem skryptów
            </summary>
            <dl className="mt-4 flex flex-col gap-3">
              {SYTUACJE_TRUDNE.map((s) => (
                <div key={s.sytuacja}>
                  <dt className="text-tresc-duza">{s.sytuacja}</dt>
                  <dd className="text-tresc leading-relaxed text-atrament-sciszony">
                    {s.skrypt}
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        </div>

        {/* PRAWA: dane uczestnika, rozjazdy, ostrzeżenia */}
        <div className="flex flex-col gap-4">
          <Rozjazdy rozjazdy={karta.rozjazdy} />
          <TrzyDrogiPanel karta={karta} />
          <PytanieUczestnika karta={karta} />
          <KtoToJest karta={karta} />
          <Ostrzezenia karta={karta} />
          <Wizja karta={karta} />
          <UsunieteWetem karta={karta} />
          <Korekty karta={karta} />
        </div>
      </div>

      {/* NA DOLE: podsumowanie, słowami uczestnika */}
      <section className="szklo p-6 sm:p-8">
        <Naglowek>Podsumowanie rozmowy (sekcja 18 raportu)</Naglowek>
        <p className="text-male text-atrament-sciszony">
          Pisane słowami uczestnika, nie Twoimi. Bez własnej oceny: raport jest jego własnością
          i ma być czytelny dla niego za dwa lata.
        </p>

        <form action={zapiszSesje} className="mt-5 flex flex-col gap-4">
          <input type="hidden" name="kod" value={karta.kodDostepu} />

          <Pole
            id="decyzja"
            etykieta="Moja decyzja na teraz (dosłownie, słowami uczestnika)"
            wartosc={s?.decyzja}
            duze
          />
          <Pole id="coPrzekonalo" etykieta="Co mnie do niej przekonało" wartosc={s?.coPrzekonalo} duze />
          <Pole id="coSprawdzic" etykieta="Co jeszcze muszę sprawdzić" wartosc={s?.coSprawdzic} duze />

          <fieldset className="flex flex-col gap-2">
            <legend className="text-male text-atrament-sciszony">
              Pierwsze kroki, każdy z datą, liczbą i czasownikiem
            </legend>
            {[1, 2, 3].map((i) => (
              <input
                key={i}
                name={`krok${i}`}
                defaultValue={s?.kroki[i - 1] ?? ""}
                aria-label={`Krok ${i}`}
                placeholder={i === 1 ? "np. do 30 września napiszę do dwóch osób z trzema pytaniami" : ""}
                className="pole min-h-12"
              />
            ))}
          </fieldset>

          <Pole id="wrocicZa" etykieta="Do czego wrócę za pół roku" wartosc={s?.wrocicZa} />
          <Pole
            id="notatka"
            etykieta="Notatka prowadzącego (trafia do raportu jako sekcja 20)"
            wartosc={s?.notatka}
            duze
          />

          <button
            type="submit"
            className="przejscie poswiata mt-2 min-h-12 w-fit rounded-xl bg-gradient-to-r from-akcent-ciemny to-akcent px-7 text-male font-bold text-na-akcencie hover:brightness-110"
          >
            Zapisz podsumowanie
          </button>
          {s?.odbyta ? (
            <p className="text-drobne text-atrament-slaby">
              Ostatni zapis: {s.odbyta.toLocaleString("pl-PL")}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}

function Pole({
  id,
  etykieta,
  wartosc,
  duze,
}: {
  id: string;
  etykieta: string;
  wartosc?: string | null;
  duze?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-male text-atrament-sciszony">
        {etykieta}
      </label>
      <textarea
        id={id}
        name={id}
        rows={duze ? 3 : 2}
        defaultValue={wartosc ?? ""}
        className="pole leading-relaxed"
      />
    </div>
  );
}
