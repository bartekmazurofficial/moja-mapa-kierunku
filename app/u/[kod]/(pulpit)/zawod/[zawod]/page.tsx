import Link from "next/link";
import { notFound } from "next/navigation";
import { pobierzKarte } from "@/lib/raport/serwer";
import { ulozKarte, wSlocie, type Blok, type Slot } from "@/lib/karty/uklad";
import { BlokKarty, Proza } from "@/components/karta/Bloki";
import { POZIOM, STUDIA, KOSZT, ZAGROZENIE } from "@/lib/karty/etykiety";
import { towarzyszeZKlastra } from "@/lib/karty/klastry";
import { obrazDuzy, obrazPlanszy } from "@/lib/ui/obrazy";

export const dynamic = "force-dynamic";

/**
 * Karta zawodu: jak wygląda życie człowieka, który to robi.
 *
 * Układ jest szablonem, nie przepisanym dokumentem: ten sam porządek sekcji,
 * te same pary i te same szerokości dla wszystkich stu pięćdziesięciu siedmiu
 * kart. Kolejność odpowiada kolejności pytań, które zadaje sobie ktoś
 * wybierający: co to w ogóle jest, jak wygląda dzień i rok, ile to kosztuje
 * ciało i głowę, co trzeba umieć, ile płacą, jak długa droga, czy to przetrwa
 * i czy to na pewno nie jest dla mnie.
 *
 * Sekcja, której karta nie ma, nie zostawia po sobie dziury: para z jedną
 * stroną rozciąga się na całą szerokość. Sekcja, której układ nie rozpoznał,
 * ląduje na końcu jako tekst do czytania — nic z karty nie może przepaść
 * tylko dlatego, że nie zmieściło się w planie.
 */
export default async function Strona({
  params,
}: {
  params: Promise<{ kod: string; zawod: string }>;
}) {
  const { kod, zawod } = await params;
  const karta = await pobierzKarte(kod, zawod);
  if (!karta) notFound();

  const bloki = ulozKarte(karta.sekcje);
  const obok = await towarzyszeZKlastra(karta.kod, karta.klasterKod);

  const w = (slot: Slot) => wSlocie(bloki, slot);
  // Sloty, ktore maja swoje miejsce w ukladzie. Reszta idzie na koniec.
  const ROZSTAWIONE: Slot[] = [
    "streszczenie", "czym_jest", "dzien", "czas", "obciazenie", "skala", "rok",
    "miekkie", "profil", "koszt", "twarde", "narzedzia", "pieniadze",
    "miedzynarodowa", "droga", "zagrozenie", "czlowiek", "kto", "mity",
    "dalej", "pokrewne",
  ];
  const reszta = bloki.filter((b) => !b.slot || !ROZSTAWIONE.includes(b.slot));

  const streszczenie = w("streszczenie");
  const ilustracja = karta.znakObszaru;
  const zdjecieHero = ilustracja ? (obrazPlanszy(ilustracja) ?? obrazDuzy(ilustracja)) : null;

  return (
    <article className="flex flex-col gap-5">
      <nav>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie inline-flex items-center gap-2 text-male font-semibold text-atrament-slaby hover:text-atrament"
        >
          <span aria-hidden>←</span> Wróć do zawodów
        </Link>
      </nav>

      {/* NAGŁÓWEK: po lewej nazwa, znaczniki i jedno zdanie; po prawej
          zdjęcie dochodzące do krawędzi, z odręcznym dopiskiem. */}
      <header className="grid items-end gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="text-drobne font-bold uppercase tracking-[0.28em] text-atrament-slaby">
            Zawód
          </p>
          <h1 className="mt-2.5 text-naglowek-duzy font-extrabold leading-[1.02] tracking-[-0.03em] text-atrament sm:text-tytul">
            {karta.tytul}
          </h1>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            <Znak>{POZIOM[karta.poziom] ?? karta.poziom}</Znak>
            <Znak>{STUDIA[karta.studia] ?? karta.studia}</Znak>
            <Znak>{karta.obszar}</Znak>
          </ul>

          {streszczenie ? (
            <div className="mt-7">
              <p className="text-tresc font-bold text-akcent-jasny">W jednym zdaniu</p>
              <div className="mt-1.5 max-w-[40rem] text-tresc-duza font-semibold leading-[1.45] text-atrament [&_p]:mt-0">
                <BlokKarty blok={streszczenie} bezTytulu bezPrzyciecia />
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[1.75rem] bg-plyta shadow-[0_18px_40px_-22px_rgba(55,74,130,0.35)]">
            {zdjecieHero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={zdjecieHero}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4 / 3" }}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div aria-hidden style={{ aspectRatio: "4 / 3" }} />
            )}
          </div>
          <p aria-hidden className="odreczny mt-3 whitespace-pre-line text-right">
            {dopisekKarty(karta.kod)}
          </p>
        </div>
      </header>

      {/* TRZY ZNACZNIKI: to, co rozstrzyga, czy w ogóle czytać dalej. */}
      <ul className="grid gap-4 sm:grid-cols-3">
        <Znacznik
          barwa={karta.flaga === "trampolina" ? "zielony" : "niebieski"}
          tytul={karta.flaga === "trampolina" ? "Dobre pierwsze miejsce pracy" : "Zawód docelowy"}
          podpis={`${POZIOM[karta.poziom] ?? karta.poziom} · ${STUDIA[karta.studia] ?? karta.studia}`}
          ikona="start"
        />
        <Znacznik
          barwa="zolty"
          tytul={KOSZT[karta.koszt] ?? karta.koszt}
          podpis="Ile trzeba wyłożyć, zanim zacznie się zarabiać"
          ikona="koszt"
        />
        <Znacznik
          barwa={["wysokie", "bardzo_wysokie"].includes(karta.zagrozenie) ? "czerwony" : "fiolet"}
          tytul={ZAGROZENIE[karta.zagrozenie] ?? karta.zagrozenie}
          podpis="Jak ten zawód wygląda za dziesięć lat"
          ikona="przyszlosc"
        />
      </ul>

      {karta.zdanieKierunkowe ? (
        <p className="szklo border-l-[3px] border-l-akcent px-6 py-5 text-tresc-duza font-semibold leading-relaxed text-atrament">
          {karta.zdanieKierunkowe}
        </p>
      ) : null}

      {!karta.pelna ? (
        <p className="szklo px-6 py-4 text-male text-atrament-sciszony">
          Ta karta jest na razie w wersji skróconej. Pełny opis powstaje.
        </p>
      ) : null}

      {obok.length > 0 ? (
        <aside className="szklo p-6">
          <p className="text-male text-atrament-sciszony">
            {obok.length === 1
              ? "Ten zawód trudno odróżnić od jednego innego na podstawie samych odpowiedzi."
              : "Ten zawód trudno odróżnić od kilku innych na podstawie samych odpowiedzi."}{" "}
            Łatwiej to rozstrzygnąć, czytając obie karty obok siebie.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {obok.map((z) => (
              <Link
                key={z.kod}
                href={`/u/${kod}/porownanie?a=${karta.kod}&b=${z.kod}`}
                className="przejscie inline-flex min-h-11 items-center gap-2 rounded-2xl bg-akcent px-6 text-male font-semibold text-na-akcencie hover:bg-akcent-ciemny"
              >
                Porównaj z: {z.nazwa} <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </aside>
      ) : null}

      {/* Dalej szablon: ta sama kolejność i te same pary na każdej karcie. */}
      <Karta blok={w("czym_jest")} tytul="Czym ta praca jest naprawdę" slot="czym_jest" duza dwieSzpalty />

      <Para>
        <Karta blok={w("skala")} tytul="Skala zawodu" slot="skala" />
        <Karta blok={w("dzien")} tytul="Zwykły dzień" slot="dzien" />
      </Para>

      <Para>
        <Karta blok={w("czas")} tytul="Na co realnie idzie czas" slot="czas" />
        <Karta blok={w("rok")} tytul="Zwykły rok" slot="rok" />
      </Para>

      <Karta
        blok={w("obciazenie")}
        tytul="Obciążenie"
        slot="obciazenie"
        duza
        obok={<span className="text-male font-semibold text-atrament-slaby">skala 1 do 5</span>}
      />

      <Karta blok={w("twarde")} tytul="Umiejętności twarde, z wymaganym poziomem" slot="twarde" duza />
      <Karta blok={w("narzedzia")} tytul="Narzędzia i programy, wyjaśnione" slot="narzedzia" duza />

      <Para>
        <Karta blok={w("miekkie")} tytul="Umiejętności miękkie" slot="miekkie" />
        <Karta blok={w("profil")} tytul="Profil, przy którym ten zawód ma sens" slot="profil" />
      </Para>

      <Para>
        <Karta blok={w("kto")} tytul="Kto się w tym nie odnajdzie" slot="kto" />
        <Karta
          blok={w("koszt")}
          tytul="Ile realnie kosztuje wejście"
          slot="koszt"
          obok={
            <span className="rounded-full bg-uwaga-tlo px-3 py-1 text-drobne font-bold text-uwaga">
              {KOSZT[karta.koszt] ?? karta.koszt}
            </span>
          }
        />
      </Para>

      <Karta blok={w("droga")} tytul="Droga dojścia" slot="droga" duza />

      <Para>
        <Karta blok={w("pieniadze")} tytul="Pieniądze na kolejnych etapach" slot="pieniadze" />
        <Karta blok={w("miedzynarodowa")} tytul="Skala międzynarodowa" slot="miedzynarodowa" />
      </Para>

      {/* Przyszłość: jedyna ciemna płyta w karcie. Nie alarm, tylko akapit,
          przy którym człowiek ma się zatrzymać. */}
      <Przyszlosc blok={w("zagrozenie")} stopien={ZAGROZENIE[karta.zagrozenie]} />

      <Para>
        <Karta blok={w("czlowiek")} tytul="Co ten zawód robi z człowiekiem" slot="czlowiek" />
        <Karta blok={w("mity")} tytul="Trzy mity" slot="mity" />
      </Para>

      <Para>
        <Karta blok={w("dalej")} tytul="Co dalej z tego zawodu" slot="dalej" />
        <Karta blok={w("pokrewne")} tytul="Zawody pokrewne" slot="pokrewne" />
      </Para>

      {reszta.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {reszta.map((b, i) => (
            <div key={`${b.rodzaj}-${i}`} className="szklo min-w-0 p-6 sm:p-7">
              <BlokKarty blok={b} />
            </div>
          ))}
        </div>
      ) : null}

      <footer className="grid gap-4 sm:grid-cols-2">
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie przycisk-pigulka flex min-h-[4.5rem] items-center justify-center gap-3.5 rounded-[1.25rem] px-6 text-tresc-duza font-bold"
        >
          <span aria-hidden>←</span> Wróć do listy
        </Link>
        <Link
          href={`/u/${kod}/zawody`}
          className="przejscie przycisk-gradient flex min-h-[4.5rem] items-center justify-center gap-3.5 rounded-[1.25rem] px-6 text-tresc-duza font-bold"
        >
          Sprawdź podobne zawody <span aria-hidden>→</span>
        </Link>
      </footer>
    </article>
  );
}

/**
 * Para sekcji obok siebie.
 *
 * Gdy karta ma tylko jedną z dwóch, ta jedna zajmuje całą szerokość, zamiast
 * zostawiać połowę wiersza pustą. Gdy nie ma żadnej, nie ma też odstępu.
 */
function Para({ children }: { children: React.ReactNode }) {
  const obecne = (Array.isArray(children) ? children : [children]).filter(Boolean);
  if (obecne.length === 0) return null;
  return (
    <div className={obecne.length === 2 ? "grid gap-5 lg:grid-cols-2" : "grid gap-5"}>{children}</div>
  );
}

/**
 * Odręczny dopisek przy zdjęciu.
 *
 * Bank czterech zdań, nie tekst generowany dla zawodu: żadne nie niesie
 * informacji, żadne nie ocenia wyniku i każde jest prawdziwe dla każdej karty.
 * Wybór po kodzie zawodu, żeby ta sama karta zawsze miała ten sam dopisek.
 */
const DOPISKI_KARTY = [
  "Nie test.\nOpis życia.",
  "Czytaj wolno.\nTo jest o Tobie.",
  "Fakty,\nnie reklama.",
  "Sprawdź,\nczy to Twój rytm.",
];

function dopisekKarty(kodZawodu: string): string {
  let suma = 0;
  for (const znak of kodZawodu) suma = (suma + znak.charCodeAt(0)) % 1000;
  return DOPISKI_KARTY[suma % DOPISKI_KARTY.length];
}

/** Znacznik słownikowy w nagłówku: biała pastylka z jedną wartością. */
function Znak({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full bg-panel px-4 py-2 text-male font-semibold text-atrament-sciszony shadow-[0_2px_10px_-5px_rgba(20,27,52,0.25)]">
      {children}
    </li>
  );
}

/**
 * Znaki sekcji: jeden na slot, w kolorze, który mówi, o jakim rodzaju rzeczy
 * mowa (czas i dzień turkusowe, pieniądze żółte, ostrzeżenia fioletowe).
 * Kolor niesie nastrój, nie informację, bo obok zawsze stoi tytuł.
 */
const ZNAKI_SLOTOW: Record<string, { sciezki: string[]; tlo: string; atrament: string }> = {
  czym_jest: { sciezki: ["M4 6h16v12H4z", "M8 10h8M8 14h5"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  skala: { sciezki: ["M4 19h16", "M7 19V11", "M12 19V6", "M17 19v-5"], tlo: "#f2ecff", atrament: "#5b21b6" },
  dzien: { sciezki: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"], tlo: "#e2f8fb", atrament: "#056b78" },
  czas: { sciezki: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 12V5", "M12 12h6"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  obciazenie: { sciezki: ["M5 20V11", "M12 20V5", "M19 20v-6"], tlo: "#fff6dc", atrament: "#8a5a00" },
  miekkie: { sciezki: ["m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"], tlo: "#f2ecff", atrament: "#5b21b6" },
  profil: { sciezki: ["M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z", "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  koszt: { sciezki: ["M4 8c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z", "M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"], tlo: "#fff6dc", atrament: "#8a5a00" },
  twarde: { sciezki: ["M12 3 4 7l8 4 8-4-8-4Z", "M4 12l8 4 8-4", "M4 17l8 4 8-4"], tlo: "#e3faed", atrament: "#067a45" },
  narzedzia: { sciezki: ["M14 6a4 4 0 0 0 4 4l-8 8-3-3 8-8a4 4 0 0 0-1-1Z", "M5 19l2-2"], tlo: "#e2f8fb", atrament: "#056b78" },
  pieniadze: { sciezki: ["M4 7h16v10H4z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"], tlo: "#fff6dc", atrament: "#8a5a00" },
  miedzynarodowa: { sciezki: ["M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z", "M3.5 12h17", "M12 3.5c2.2 2.4 3.4 5.3 3.4 8.5s-1.2 6.1-3.4 8.5c-2.2-2.4-3.4-5.3-3.4-8.5s1.2-6.1 3.4-8.5Z"], tlo: "#f2ecff", atrament: "#5b21b6" },
  droga: { sciezki: ["M6 20c0-6 12-6 12-12", "M6 20v-3", "M18 8V5"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
  czlowiek: { sciezki: ["M12 20S4 14.6 4 9.4A4.4 4.4 0 0 1 12 6.8 4.4 4.4 0 0 1 20 9.4C20 14.6 12 20 12 20Z"], tlo: "#ffe9ee", atrament: "#c00030" },
  kto: { sciezki: ["M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z", "M8 12h8"], tlo: "#ffe9ee", atrament: "#c00030" },
  mity: { sciezki: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5", "M12 17h.01"], tlo: "#f2ecff", atrament: "#5b21b6" },
  rok: { sciezki: ["M4 6h16v14H4z", "M4 10h16", "M8 4v4M16 4v4"], tlo: "#e2f8fb", atrament: "#056b78" },
  dalej: { sciezki: ["M5 12h14", "m13 6 6 6-6 6"], tlo: "#e3faed", atrament: "#067a45" },
  pokrewne: { sciezki: ["M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "m11 11 2 2"], tlo: "#e9f0ff", atrament: "#0a3ac9" },
};

function ZnakSekcji({ slot, duzy }: { slot: string; duzy?: boolean }) {
  const z = ZNAKI_SLOTOW[slot];
  if (!z) return null;
  return (
    <span
      aria-hidden
      className={`znak-sekcji ${duzy ? "znak-sekcji-duzy" : ""}`}
      style={{ background: z.tlo, color: z.atrament }}
    >
      <svg viewBox="0 0 24 24" width={duzy ? 26 : 22} height={duzy ? 26 : 22} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {z.sciezki.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  );
}

/** Jedna sekcja w swojej płycie, ze znakiem. Bez bloku nie renderuje się nic. */
function Karta({
  blok,
  tytul,
  slot,
  duza,
  dwieSzpalty,
  obok,
}: {
  blok: Blok | null;
  tytul: string;
  slot: string;
  /** Sekcja na całą szerokość: większy nagłówek i większy oddech. */
  duza?: boolean;
  /** Proza w dwóch szpaltach: tylko tam, gdzie tekst jest długi i ciągły. */
  dwieSzpalty?: boolean;
  /** Drobiazg obok nagłówka, na przykład „skala 1 do 5". */
  obok?: React.ReactNode;
}) {
  if (!blok) return null;
  return (
    <section className={`szklo min-w-0 ${duza ? "p-6 sm:p-8" : "p-6 sm:p-7"}`}>
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <ZnakSekcji slot={slot} duzy={duza} />
        <h2
          className={`font-extrabold leading-tight tracking-tight text-atrament ${
            duza ? "text-naglowek-maly sm:text-[1.55rem]" : "text-naglowek-maly"
          }`}
        >
          {tytul}
        </h2>
        {obok}
      </div>
      <div className={dwieSzpalty ? "gap-x-11 lg:columns-2 [&_p]:break-inside-avoid" : undefined}>
        <BlokKarty blok={blok} bezTytulu bezPrzyciecia />
      </div>
    </section>
  );
}

/**
 * Przyszłość zawodu na ciemnej płycie.
 *
 * Jedyne ciemne miejsce w karcie i jedyne, które ma zatrzymać wzrok. To nie
 * jest ostrzeżenie ani alarm: werdykt stoi jako zdanie, a pod nim leży pełne
 * uzasadnienie, bo sam stopień bez niego znaczy tyle co nic.
 */
function Przyszlosc({ blok, stopien }: { blok: Blok | null; stopien?: string }) {
  if (!blok) return null;
  const werdykt = blok.rodzaj === "zagrozenie" ? blok.werdykt : null;
  const uwagi = blok.rodzaj === "zagrozenie" ? blok.uwagi : null;
  return (
    <section className="rounded-karta px-6 py-7 text-na-akcencie shadow-[0_24px_50px_-26px_rgba(27,35,82,0.7)] sm:px-9 sm:py-9"
      style={{ background: "linear-gradient(150deg, #161c45, #202a5e 45%, #362b66)" }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span aria-hidden className="znak-sekcji znak-sekcji-duzy bg-white/15 text-[#a9bdff]">
          <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16.5 9 10l4 3.5 6.5-8" />
            <path d="M14.5 5.5h5v5" />
          </svg>
        </span>
        <h2 className="text-naglowek-maly font-extrabold leading-tight tracking-tight sm:text-[1.55rem]">
          Czy ten zawód jest zagrożony w przyszłości
        </h2>
        {stopien ? (
          <span className="rounded-full bg-white/15 px-3 py-1 text-drobne font-bold text-[#d8deff]">
            {stopien}
          </span>
        ) : null}
      </div>

      {werdykt ? (
        <p className="mt-6 max-w-[56rem] text-tresc-duza font-bold leading-[1.5]">{werdykt}</p>
      ) : null}

      {uwagi ? (
        <div className="mt-6 rounded-[1.1rem] bg-white/10 px-5 py-5 sm:px-6">
          <div className="proza-ciemna">
            <Proza tresc={uwagi} />
          </div>
        </div>
      ) : null}

      {!werdykt ? (
        <div className="mt-6 proza-ciemna">
          <BlokKarty blok={blok} bezTytulu bezPrzyciecia />
        </div>
      ) : null}
    </section>
  );
}

const BARWY: Record<string, { obwod: string; tlo: string; atrament: string }> = {
  zielony: { obwod: "#8fe3b8", tlo: "#e3faed", atrament: "#067a45" },
  niebieski: { obwod: "#9cbcff", tlo: "#e9f0ff", atrament: "#0a3ac9" },
  zolty: { obwod: "#f0cf6a", tlo: "#fff6dc", atrament: "#8a5a00" },
  czerwony: { obwod: "#ffa9bc", tlo: "#ffe9ee", atrament: "#c00030" },
  fiolet: { obwod: "#c3a9f7", tlo: "#f2ecff", atrament: "#5b21b6" },
};

const ZNAKI: Record<string, string[]> = {
  start: ["M12 20v-8", "M12 12c0-3 2-5 5-5 0 3-2 5-5 5Z", "M12 14c0-2.5-1.7-4-4-4 0 2.5 1.7 4 4 4Z"],
  koszt: ["M4 8c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z", "M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"],
  przyszlosc: ["M12 4 3 19h18L12 4Z", "M12 10v4", "M12 17h.01"],
};

/**
 * Znacznik na górze karty: trzy rzeczy, które decydują o tym, czy w ogóle
 * czytać dalej. Kolor jest tu na miejscu, bo niesie znaczenie, a obok niego
 * zawsze stoi pełne zdanie.
 */
function Znacznik({
  barwa,
  tytul,
  podpis,
  ikona,
}: {
  barwa: keyof typeof BARWY | string;
  tytul: string;
  podpis: string;
  ikona: keyof typeof ZNAKI;
}) {
  const b = BARWY[barwa] ?? BARWY.niebieski;
  return (
    <li className="szklo flex items-center gap-4 px-5 py-4">
      <span
        aria-hidden
        className="znak-sekcji"
        style={{ background: b.tlo, color: b.atrament }}
      >
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {ZNAKI[ikona].map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-male font-bold leading-snug text-atrament">{tytul}</span>
        <span className="mt-0.5 block text-drobne leading-relaxed text-atrament-sciszony">
          {podpis}
        </span>
      </span>
    </li>
  );
}
