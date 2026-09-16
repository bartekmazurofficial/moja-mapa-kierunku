import { Blok } from "./Karta";
import { zl } from "@/lib/ui/kwota";
import { OPISY_PASM, type PasmoFinansowe } from "@/lib/engine/zarobki";
import type { KartaNowegoProgramu } from "@/lib/raport/nowy";

/**
 * KARTA UCZESTNIKA NOWEGO PROGRAMU.
 *
 * Prowadzacy ma pietnascie minut na przygotowanie do sesji, wiec kolejnosc
 * blokow jest kolejnoscia rozmowy, a nie kolejnoscia modulow: najpierw to,
 * co uczestnik sam o sobie wie, potem to, czego o sobie nie widzi
 * (rozjazdy), potem pieniadze, na koncu zawody.
 *
 * Rozjazd miedzy „lubie" a „umiem" jest tu najwazniejszy i dlatego stoi
 * wysoko. Uczestnik widzi w raporcie trzy listy, ale nie widzi, ze jedna
 * z nich jest tematem na rozmowe, a nie ciekawostka.
 */

function Lista({ pozycje }: { pozycje: string[] }) {
  if (pozycje.length === 0) return <p className="text-male text-atrament-slaby">brak danych</p>;
  return (
    <ol className="flex flex-col gap-1 text-male">
      {pozycje.map((p, i) => (
        <li key={p}>
          <span className="text-atrament-slaby">{i + 1}.</span> {p}
        </li>
      ))}
    </ol>
  );
}

export function KartaNowa({ karta }: { karta: KartaNowegoProgramu }) {
  return (
    <div className="flex flex-col gap-4">
      {karta.brakujaceModuly.length > 0 ? (
        <Blok tytul="Czego jeszcze nie ma">
          <p className="text-male">
            Niedomknięte moduły: {karta.brakujaceModuly.join(", ")}. Wszystko poniżej liczy się
            z tego, co już jest, więc czytaj to jako obraz niepełny.
          </p>
        </Blok>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Blok tytul="Co go ciekawi">
          <Lista pozycje={karta.tematy} />
        </Blok>
        <Blok tytul="Co lubi robić">
          <Lista pozycje={karta.lubie} />
        </Blok>
        <Blok tytul="W czym jest dobry">
          <Lista pozycje={karta.umiem} />
        </Blok>
      </div>

      <Blok tytul="Rozjazdy: tu warto zapytać">
        {karta.rozjazdy.length === 0 ? (
          <p className="text-male text-atrament-slaby">
            Brak rozjazdów. Oba tory pokrywają się mocno, co samo w sobie jest informacją.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-male">
            {karta.rozjazdy.map((r) => (
              <li key={r.czynnosc}>
                <span className="font-semibold">{r.czynnosc}:</span>{" "}
                <span className="text-atrament-sciszony">
                  {r.strona === "lubie"
                    ? "chce to robić, ale nie ma jeszcze na to dowodów"
                    : "wychodzi mu, ale sam tego nie wybiera"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Blok>

      <Blok tytul="Poziom życia, który sobie zaprojektował">
        {karta.poziom ? (
          <>
            <p className="text-male">
              Minimum <strong>{zl(karta.poziom.minimum)}</strong> · komfort{" "}
              <strong>{zl(karta.poziom.komfort)}</strong> · cel{" "}
              <strong>{zl(karta.poziom.cel)}</strong> netto miesięcznie.
            </p>
            {karta.kosztNajwiekszy.length > 0 ? (
              <p className="mt-2 text-male text-atrament-sciszony">
                Najbardziej podnoszą to:{" "}
                {karta.kosztNajwiekszy
                  .map((s) => `${s.nazwa} ${zl(s.kwota)} (${s.udzial}%)`)
                  .join(" · ")}
                .
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-male text-atrament-slaby">Moduł poziomu życia niedomknięty.</p>
        )}
      </Blok>

      <Blok tytul="Zawody z silnika: punkt wyjścia do rozmowy, nie rekomendacja">
        {karta.zawody.length === 0 ? (
          <p className="text-male text-atrament-slaby">
            Brak danych z modułów czynności, więc nie ma z czego liczyć.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {karta.zawody.map((z) => (
              <li key={z.nazwa} className="border-b border-linia pb-2.5 last:border-0 last:pb-0">
                <p className="text-male">
                  <span className="font-semibold">{z.nazwa}</span>
                  {z.bezStudiow ? (
                    <span className="ml-2 text-drobne text-atrament-slaby">bez studiów</span>
                  ) : null}
                  {z.widelki ? (
                    <span className="ml-2 text-drobne text-atrament-slaby">{z.widelki}</span>
                  ) : null}
                </p>
                {z.trafienia.length > 0 ? (
                  <p className="text-drobne text-atrament-sciszony">
                    z jego zaznaczeń: {z.trafienia.join(", ")}
                  </p>
                ) : null}
                <p className="text-drobne text-atrament-sciszony">
                  {OPISY_PASM[z.pasmoFinansowe as PasmoFinansowe]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Blok>
    </div>
  );
}
