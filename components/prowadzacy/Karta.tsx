import { nazwaTypu, type Rozjazd } from "@/lib/panel/rozjazdy";
import type { KartaUczestnika } from "@/lib/prowadzacy/dane";

export function Naglowek({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-drobne uppercase tracking-[0.08em] text-atrament-slaby">{children}</h2>
  );
}

export function Blok({ tytul, children }: { tytul: string; children: React.ReactNode }) {
  return (
    <section className="szklo p-5">
      <Naglowek>{tytul}</Naglowek>
      {children}
    </section>
  );
}

function Lista({ pozycje }: { pozycje: string[] }) {
  if (pozycje.length === 0) return <p className="text-male text-atrament-slaby">brak danych</p>;
  return <p className="text-male">{pozycje.join(" · ")}</p>;
}

/** Pięć obszarów, pięć kompetencji, trzy bieguny, pięć wartości, weta. */
export function KtoToJest({ karta }: { karta: KartaUczestnika }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Blok tytul="Co go ciągnie">
        <Lista pozycje={karta.coGoCiagnie} />
      </Blok>
      <Blok tytul="W czym może być dobry">
        <Lista pozycje={karta.wCzymMozeBycDobry} />
      </Blok>
      <Blok tytul="Jak działa">
        <Lista pozycje={karta.jakDziala} />
      </Blok>
      <Blok tytul="Co jest ważne">
        <Lista pozycje={karta.coJestWazne} />
      </Blok>
      <div className="sm:col-span-2">
        <Blok tytul="Czego nie chce">
          <Lista pozycje={karta.czegoNieChce} />
        </Blok>
      </div>
    </div>
  );
}

export function TrzyDrogiPanel({ karta }: { karta: KartaUczestnika }) {
  return (
    <Blok tytul="Trzy drogi">
      <ul className="flex flex-col gap-3">
        {karta.drogi.map((d) => (
          <li key={d.etykieta}>
            <p className="text-tresc-duza">
              <span className="text-atrament-slaby">{d.etykieta}</span> {d.obszar}
            </p>
            <p className="text-male text-atrament-sciszony">{d.poziom}</p>
            <p className="text-male">{d.zawody.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </Blok>
  );
}

/**
 * Najwazniejsza sekcja calego panelu. Kazdy rozjazd to gotowy temat rozmowy,
 * z pytaniem do zadania wprost ze specyfikacji sesji.
 */
export function Rozjazdy({ rozjazdy }: { rozjazdy: Rozjazd[] }) {
  return (
    <section className="szklo szklo-akcent p-5">
      <Naglowek>Rozjazdy — po to jest ta sesja</Naglowek>
      {rozjazdy.length === 0 ? (
        <p className="text-tresc leading-relaxed">
          System nie znalazł sprzeczności. To nie znaczy, że ich nie ma — znaczy, że rozmowę
          zaczynasz od pytania otwartego, nie od gotowego tematu.
        </p>
      ) : (
        <ol className="flex flex-col gap-4">
          {rozjazdy.map((r, i) => (
            <li key={i} className="border-l-2 border-akcent/50 pl-4">
              <p className="text-drobne uppercase tracking-[0.08em] text-atrament-slaby">
                {nazwaTypu(r.typ)}
              </p>
              <p className="text-tresc-duza">{r.tytul}</p>
              <p className="text-male text-atrament-sciszony">{r.obserwacja}</p>
              <p className="mt-1.5 text-tresc leading-relaxed">„{r.pytanie}”</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function Ostrzezenia({ karta }: { karta: KartaUczestnika }) {
  if (karta.ostrzezenia.length === 0) return null;
  return (
    <Blok tytul="Ostrzeżenia antyprofilowe — do omówienia, nie do przemilczenia">
      <ul className="flex flex-col gap-3">
        {karta.ostrzezenia.map((o) => (
          <li key={o.zawod} className="rounded-lg bg-uwaga-tlo p-3">
            <p className="text-tresc-duza">
              {o.zawod} <span className="text-male text-atrament-slaby">droga {o.droga}</span>
            </p>
            {o.zdania.map((z, i) => (
              <p key={i} className="text-male text-uwaga">
                {z}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </Blok>
  );
}

export function Wizja({ karta }: { karta: KartaUczestnika }) {
  return (
    <Blok tytul="Wizja życia, pełny tekst">
      {karta.wizja.length === 0 ? (
        <p className="text-male text-atrament-slaby">Nie wypełnił. To wolno.</p>
      ) : (
        <dl className="flex flex-col gap-3">
          {karta.wizja.map((w) => (
            <div key={w.tytul}>
              <dt className="text-male text-atrament-slaby">{w.tytul}</dt>
              <dd className="text-tresc leading-relaxed">{w.tresc}</dd>
            </div>
          ))}
        </dl>
      )}
    </Blok>
  );
}

export function PytanieUczestnika({ karta }: { karta: KartaUczestnika }) {
  return (
    <Blok tytul="Pytanie zapisane na spotkaniu 4">
      {karta.pytanie ? (
        <p className="text-tresc-duza font-semibold leading-relaxed">„{karta.pytanie}”</p>
      ) : (
        <p className="text-male text-atrament-slaby">Nie zapisał pytania.</p>
      )}
    </Blok>
  );
}

/** Lista strat. Widzi ją wyłącznie prowadzący — uczestnik nigdy. */
export function UsunieteWetem({ karta }: { karta: KartaUczestnika }) {
  if (karta.usunieteWetem.length === 0) return null;
  return (
    <Blok tytul={`Odpadło przez weto — ${karta.usunieteWetem.length} zawodów, tylko dla Ciebie`}>
      <ul className="flex flex-col gap-1.5">
        {karta.usunieteWetem.slice(0, 12).map((z) => (
          <li key={z.nazwa} className="text-male">
            {z.nazwa}{" "}
            <span className="text-atrament-slaby">— {z.filtry.join(", ")}</span>
          </li>
        ))}
      </ul>
      {karta.usunieteWetem.length > 12 ? (
        <p className="mt-2 text-male text-atrament-slaby">
          i {karta.usunieteWetem.length - 12} dalszych
        </p>
      ) : null}
    </Blok>
  );
}
