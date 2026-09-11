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

export const dynamic = "force-dynamic";

/** Widok dwukolumnowy, używany na żywo w trakcie rozmowy. */
export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  if (!(await zalogowany())) return <Logowanie />;
  const { kod } = await params;
  const karta = await pobierzKarteUczestnika(kod);
  if (!karta) notFound();
  const s = karta.sesja;

  return (
    <main className="mx-auto max-w-[86rem] px-5 py-8 sm:px-8">
      <Link
        href={`/prowadzacy/uczestnik/${karta.kodDostepu}`}
        className="przejscie text-male text-atrament-slaby hover:text-atrament"
      >
        ← Karta uczestnika
      </Link>
      <h1 className="mt-3 text-naglowek-duzy font-extrabold tracking-tight leading-tight">Sesja · {karta.imie}</h1>
      <p className="mt-1 text-male text-atrament-slaby">
        Sześćdziesiąt minut. To jest spotkanie decyzyjne, nie kolejne spotkanie odkrywania siebie.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* LEWA: przebieg z minutami, pytania, skrypty */}
        <div className="flex flex-col gap-4">
          <ol className="flex flex-col gap-3">
            {PRZEBIEG.map((e) => (
              <li key={e.minuty} className="szklo p-5">
                <p className="text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
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
      <section className="mt-10 szklo p-6">
        <Naglowek>Podsumowanie rozmowy — sekcja 18 raportu</Naglowek>
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
              Pierwsze kroki — każdy z datą, liczbą i czasownikiem
            </legend>
            {[1, 2, 3].map((i) => (
              <input
                key={i}
                name={`krok${i}`}
                defaultValue={s?.kroki[i - 1] ?? ""}
                aria-label={`Krok ${i}`}
                placeholder={i === 1 ? "np. do 30 września napiszę do dwóch osób z trzema pytaniami" : ""}
                className="min-h-11 rounded-lg border border-linia-mocna bg-szklo px-3 text-male"
              />
            ))}
          </fieldset>

          <Pole id="wrocicZa" etykieta="Do czego wrócę za pół roku" wartosc={s?.wrocicZa} />
          <Pole
            id="notatka"
            etykieta="Notatka prowadzącego — trafia do raportu jako sekcja 20"
            wartosc={s?.notatka}
            duze
          />

          <button
            type="submit"
            className="przejscie mt-1 min-h-11 w-fit rounded-lg bg-akcent px-6 text-male font-medium text-na-akcencie hover:bg-akcent-ciemny"
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
        className="rounded-lg border border-linia-mocna bg-szklo px-3 py-2 text-male leading-relaxed"
      />
    </div>
  );
}
