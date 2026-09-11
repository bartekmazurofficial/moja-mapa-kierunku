import { cofnijKorekte, dopiszKorekte } from "@/lib/prowadzacy/akcje";
import type { KartaUczestnika } from "@/lib/prowadzacy/dane";
import { Blok } from "./Karta";

const OPISY: Record<string, string> = {
  dopisany_zawod: "dopisany zawód",
  usuniety_zawod: "usunięty zawód",
  kolejnosc_drog: "zmieniona kolejność dróg",
  do_przeliczenia: "do ponownego przeliczenia",
};

/**
 * Korekta reczna. Obowiazkowa, nie opcjonalna: uczestnik zawsze ma prawo do
 * zawodu spoza listy, a prowadzacy musi moc go dopisac w trakcie rozmowy.
 * Kazda korekta jest widoczna w raporcie jako pochodzaca od czlowieka.
 */
export function Korekty({ karta }: { karta: KartaUczestnika }) {
  const nazwy = new Map(karta.wszystkieZawody.map((z) => [z.kod, z.nazwa]));
  const wRaporcie = karta.drogi.flatMap((d) => d.zawody);

  return (
    <Blok tytul="Korekta ręczna">
      <p className="text-male text-atrament-sciszony">
        Każda korekta trafia do raportu podpisana jako Twoja. Uczestnik ma wiedzieć, co powiedział
        mu algorytm, a co człowiek.
      </p>

      {karta.korekty.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {karta.korekty.map((k) => (
            <li key={k.id} className="flex items-baseline justify-between gap-3 border-b border-linia pb-2">
              <span className="text-male">
                <span className="text-atrament-slaby">{OPISY[k.typ] ?? k.typ}:</span>{" "}
                {k.wartosc ? (nazwy.get(k.wartosc) ?? k.wartosc) : "—"}
                {k.uzasadnienie ? (
                  <span className="block text-drobne text-atrament-slaby">{k.uzasadnienie}</span>
                ) : null}
              </span>
              <form action={cofnijKorekte}>
                <input type="hidden" name="id" value={k.id} />
                <input type="hidden" name="kod" value={karta.kodDostepu} />
                <button
                  type="submit"
                  className="przejscie text-drobne text-atrament-slaby underline underline-offset-4 hover:text-uwaga"
                >
                  cofnij
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : null}

      <form action={dopiszKorekte} className="mt-5 flex flex-col gap-3">
        <input type="hidden" name="kod" value={karta.kodDostepu} />

        <label htmlFor="typ" className="text-male text-atrament-sciszony">
          Rodzaj korekty
        </label>
        <select
          id="typ"
          name="typ"
          className="pole min-h-12"
          defaultValue="dopisany_zawod"
        >
          <option value="dopisany_zawod">Dopisz zawód spoza wyniku</option>
          <option value="usuniety_zawod">Usuń zawód z listy</option>
          <option value="kolejnosc_drog">Zmień kolejność dróg</option>
          <option value="do_przeliczenia">Oznacz do ponownego przeliczenia</option>
        </select>

        <label htmlFor="wartosc" className="text-male text-atrament-sciszony">
          Zawód albo kolejność dróg (np. BAC)
        </label>
        <input
          id="wartosc"
          name="wartosc"
          list="zawody-lista"
          placeholder="kod zawodu albo BAC"
          className="pole min-h-12"
        />
        <datalist id="zawody-lista">
          {karta.wszystkieZawody.map((z) => (
            <option key={z.kod} value={z.kod}>
              {z.nazwa}
            </option>
          ))}
        </datalist>

        <label htmlFor="uzasadnienie" className="text-male text-atrament-sciszony">
          Krótkie uzasadnienie
        </label>
        <input
          id="uzasadnienie"
          name="uzasadnienie"
          className="pole min-h-12"
        />

        <button
          type="submit"
          className="przejscie mt-2 min-h-12 w-fit rounded-xl border border-akcent/45 bg-akcent-tlo px-6 text-male font-bold text-akcent-jasny hover:border-akcent"
        >
          Zapisz korektę
        </button>
      </form>

      {wRaporcie.length > 0 ? (
        <p className="mt-4 text-drobne text-atrament-slaby">
          W trzech drogach są teraz: {wRaporcie.join(", ")}.
        </p>
      ) : null}
    </Blok>
  );
}
