import Link from "next/link";

/**
 * Ekran po ukończeniu assessmentu.
 *
 * Uczestnik właśnie skończył kilkadziesiąt minut pracy i dotąd dostawał za to
 * jeden akapit. Tutaj dostaje moment: pierścień się domyka, ptaszek się rysuje,
 * iskry rozchodzą się na boki, a dopiero potem pojawia się tekst i wyjście dalej.
 *
 * Dwie rzeczy, które wyglądają na ozdobę, a są regułą:
 *
 *   - **Znaczniki mówią o pracy, nie o wyniku.** Ile odpowiedzi, ile zestawów,
 *     ile minut. Nigdy „ile zawodów Ci się dopasowało": wynik odsłania
 *     prowadzący na spotkaniu i nic z niego nie ma prawa wyciec wcześniej.
 *   - **Pochwała dotyczy wysiłku, nie odpowiedzi.** „Świetna robota" znaczy
 *     „doszedłeś do końca", nie „dobrze wypadłeś". W tych modułach nie da się
 *     wypaść dobrze ani źle i nigdzie tego nie sugerujemy.
 *
 * Cały ruch siedzi w `@media (prefers-reduced-motion: no-preference)`
 * (app/globals.css), więc przy wyłączonych animacjach ekran jest ten sam,
 * tylko od razu gotowy.
 */
export function Ukonczenie({
  kodUczestnika,
  modul,
  nazwaModulu,
  zamkniecie,
  znaczniki,
  zObszarami,
}: {
  kodUczestnika: string;
  modul: string;
  nazwaModulu: string;
  /** Zdanie zamykające moduł, z lib/content/wspolne.ts. */
  zamkniecie: string;
  /** Fakty o wykonanej pracy. Nigdy nic o wyniku. */
  znaczniki: string[];
  /** A0 nie ma ekranu odpowiedzi, więc nie pokazujemy do niego wyjścia. */
  zObszarami: boolean;
}) {
  const KROPKI = ["#1d5bff", "#6d3df5", "#b8460f"];

  return (
    <main
      className="ukonczenie relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
      style={{
        background:
          "radial-gradient(120% 90% at 78% 4%, #fde3d6 0%, rgba(253,227,214,0) 46%), radial-gradient(90% 70% at 12% 92%, #f3dcf6 0%, rgba(243,220,246,0) 52%), linear-gradient(168deg, #eef0fc 0%, #e7eafb 42%, #f3eefb 100%)",
      }}
    >
      {/* Trzy plamy koloru pod spodem, w bardzo wolnym ruchu. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-ruch
          data-ozdoba
          className="absolute -right-[8%] -top-[14%] h-[38rem] w-[38rem] rounded-full blur-[14px]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,176,140,.55), rgba(255,176,140,0) 68%)",
            ["--ruch" as string]: "plyniecie",
            ["--czas" as string]: "18s",
            ["--powtorzenia" as string]: "infinite",
          }}
        />
        <div
          data-ruch
          data-ozdoba
          className="absolute -bottom-[22%] -left-[10%] h-[42rem] w-[42rem] rounded-full blur-[16px]"
          style={{
            background:
              "radial-gradient(circle at 55% 45%, rgba(150,140,255,.42), rgba(150,140,255,0) 68%)",
            ["--ruch" as string]: "plyniecie-wstecz",
            ["--czas" as string]: "22s",
            ["--powtorzenia" as string]: "infinite",
          }}
        />
        <div
          data-ruch
          data-ozdoba
          className="absolute left-[44%] top-[26%] h-[32rem] w-[32rem] rounded-full blur-[18px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,150,205,.26), rgba(255,150,205,0) 70%)",
            ["--ruch" as string]: "plyniecie",
            ["--czas" as string]: "26s",
            ["--powtorzenia" as string]: "infinite",
          }}
        />
      </div>

      {/* Błysk: jedno mgnienie bieli dokładnie wtedy, gdy domyka się ptaszek. */}
      <div
        aria-hidden
        data-ruch
        data-ozdoba
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 40% at 50% 40%, rgba(255,255,255,.95), rgba(255,255,255,0) 70%)",
          ["--ruch" as string]: "blysk",
          ["--czas" as string]: "1100ms",
          ["--zwloka" as string]: "980ms",
          ["--krzywa" as string]: "ease-out",
        }}
      />

      <p
        data-ruch
        className="absolute left-6 top-8 flex items-center gap-3 sm:left-11 sm:top-10"
        style={{ ["--ruch" as string]: "rozjasnienie", ["--czas" as string]: "700ms", ["--zwloka" as string]: "120ms" }}
      >
        <span className="text-drobne font-bold uppercase tracking-[0.16em] text-atrament-slaby">
          {nazwaModulu}
        </span>
      </p>

      <div className="relative flex w-full max-w-[48rem] flex-col items-center">
        {/* ZNAK: pierścień, który się domyka, i ptaszek, który się rysuje. */}
        <div className="relative mb-9 flex h-[13.75rem] w-[13.75rem] items-center justify-center">
          <Iskry />

          {[0, 1].map((i) => (
            <span
              key={i}
              aria-hidden
              data-ruch
              data-ozdoba
              className="absolute h-[11.25rem] w-[11.25rem] rounded-full border-[1.5px]"
              style={{
                borderColor: i === 0 ? "rgba(109,61,245,.45)" : "rgba(184,70,15,.3)",
                ["--ruch" as string]: "rozkwit",
                ["--czas" as string]: i === 0 ? "1500ms" : "1700ms",
                ["--zwloka" as string]: i === 0 ? "980ms" : "1180ms",
              }}
            />
          ))}

          <span
            aria-hidden
            data-ruch
            data-ozdoba
            className="absolute h-[10.75rem] w-[10.75rem] rounded-full blur-[6px]"
            style={{
              background: "radial-gradient(circle, rgba(109,61,245,.35), rgba(109,61,245,0) 70%)",
              ["--ruch" as string]: "tetno",
              ["--czas" as string]: "3600ms",
              ["--zwloka" as string]: "1200ms",
              ["--powtorzenia" as string]: "infinite",
            }}
          />

          <span
            data-ruch
            className="relative flex h-[10.25rem] w-[10.25rem] items-center justify-center rounded-full border border-white/95 backdrop-blur-[14px]"
            style={{
              background: "linear-gradient(150deg, rgba(255,255,255,.9), rgba(255,255,255,.55))",
              boxShadow: "0 24px 60px rgba(86,84,170,.22), inset 0 1px 0 rgba(255,255,255,.9)",
              ["--ruch" as string]: "wyskok",
              ["--czas" as string]: "800ms",
              ["--zwloka" as string]: "180ms",
            }}
          >
            <svg aria-hidden viewBox="0 0 164 164" className="absolute inset-0 -rotate-90" fill="none">
              <circle cx="82" cy="82" r="76" stroke="rgba(120,126,180,.14)" strokeWidth="5" />
              <circle
                data-ruch
                cx="82"
                cy="82"
                r="76"
                stroke="url(#ukonczenie-pierscien)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="478"
                style={{
                  ["--ruch" as string]: "pierscien",
                  ["--czas" as string]: "1000ms",
                  ["--zwloka" as string]: "260ms",
                }}
              />
              <defs>
                <linearGradient id="ukonczenie-pierscien" x1="6" y1="20" x2="158" y2="150">
                  <stop stopColor="#1d5bff" />
                  <stop offset=".5" stopColor="#6d3df5" />
                  <stop offset="1" stopColor="#b8460f" />
                </linearGradient>
              </defs>
            </svg>
            <svg aria-hidden viewBox="0 0 72 72" className="h-[4.5rem] w-[4.5rem]" fill="none">
              <path
                data-ruch
                d="M20 37.5 31.5 49 53 25"
                stroke="url(#ukonczenie-ptaszek)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="56"
                style={{
                  ["--ruch" as string]: "ptaszek",
                  ["--czas" as string]: "520ms",
                  ["--zwloka" as string]: "1000ms",
                }}
              />
              <defs>
                <linearGradient id="ukonczenie-ptaszek" x1="20" y1="49" x2="53" y2="25">
                  <stop stopColor="#1d5bff" />
                  <stop offset="1" stopColor="#6d3df5" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>

        <p
          data-ruch
          className="mb-4 text-drobne font-bold uppercase tracking-[0.22em] text-atrament-slaby"
          style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "700ms", ["--zwloka" as string]: "1280ms" }}
        >
          Assessment zakończony
        </p>

        <h1 className="text-naglowek-duzy font-extrabold leading-[1.06] tracking-[-0.035em] text-atrament sm:text-tytul">
          <span
            data-ruch
            className="block"
            style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "820ms", ["--zwloka" as string]: "1380ms" }}
          >
            Świetna robota.
          </span>
          <span
            data-ruch
            className="gradient-tytul block pb-[0.08em] leading-[1.22]"
            style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "820ms", ["--zwloka" as string]: "1520ms" }}
          >
            Twoje odpowiedzi są zapisane
          </span>
        </h1>

        <p
          data-ruch
          className="mt-5 max-w-[34rem] text-tresc-duza font-medium leading-relaxed text-atrament-sciszony"
          style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "780ms", ["--zwloka" as string]: "1680ms" }}
        >
          {zamkniecie}
        </p>

        {znaczniki.length > 0 ? (
          <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
            {znaczniki.map((z, i) => (
              <li
                key={z}
                data-ruch
                className="flex items-center gap-2.5 rounded-full border border-white/90 bg-white/70 px-4.5 py-3 text-male font-semibold text-atrament-sciszony shadow-[0_10px_26px_rgba(86,84,170,0.1)]"
                style={{
                  ["--ruch" as string]: "wschod",
                  ["--czas" as string]: "700ms",
                  ["--zwloka" as string]: `${1820 + i * 80}ms`,
                }}
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: KROPKI[i % KROPKI.length] }}
                />
                {z}
              </li>
            ))}
          </ul>
        ) : null}

        <div
          data-ruch
          className="relative mt-10"
          style={{ ["--ruch" as string]: "wschod", ["--czas" as string]: "760ms", ["--zwloka" as string]: "2100ms" }}
        >
          <span
            aria-hidden
            data-ruch
            data-ozdoba
            className="absolute -inset-x-2.5 -inset-y-3.5 rounded-full blur-[22px]"
            style={{
              background: "linear-gradient(96deg, #1d5bff, #6d3df5, #b8460f)",
              opacity: 0.5,
              ["--ruch" as string]: "tetno",
              ["--czas" as string]: "3200ms",
              ["--zwloka" as string]: "2400ms",
              ["--powtorzenia" as string]: "infinite",
            }}
          />
          <Link
            href={zObszarami ? `/u/${kodUczestnika}/wyniki/${modul}` : `/u/${kodUczestnika}/moduly`}
            className="przejscie przycisk-gradient relative inline-flex min-h-[3.75rem] items-center gap-3.5 overflow-hidden rounded-full px-10 text-tresc-duza font-bold"
          >
            {zObszarami ? "Zobacz swoje odpowiedzi" : "Wróć do listy"}
            <span aria-hidden>→</span>
            {/* Połysk przechodzący przez przycisk: to jedyna rzecz do zrobienia
                na tym ekranie i ma być widać, gdzie kliknąć. */}
            <span
              aria-hidden
              data-ruch
              data-ozdoba
              className="absolute inset-y-0 left-0 w-2/5"
              style={{
                background:
                  "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))",
                ["--ruch" as string]: "polysk",
                ["--czas" as string]: "3000ms",
                ["--zwloka" as string]: "2500ms",
                ["--krzywa" as string]: "ease-in-out",
                ["--powtorzenia" as string]: "infinite",
              }}
            />
          </Link>
        </div>

        <div
          data-ruch
          className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          style={{ ["--ruch" as string]: "rozjasnienie", ["--czas" as string]: "700ms", ["--zwloka" as string]: "2320ms" }}
        >
          <Link
            href={`/u/${kodUczestnika}/moduly`}
            className="przejscie text-male font-semibold text-atrament-slaby hover:text-akcent-jasny"
          >
            Wróć do panelu
          </Link>
          <Link
            href={`/u/${kodUczestnika}/modul/${modul}/od-nowa`}
            className="przejscie text-male font-semibold text-atrament-slaby hover:text-akcent-jasny"
          >
            Wypełnij od nowa
          </Link>
        </div>
      </div>

      <p
        aria-hidden
        data-ruch
        className="odreczny absolute bottom-11 left-14 hidden text-left lg:block"
        style={{ ["--ruch" as string]: "rozjasnienie", ["--czas" as string]: "900ms", ["--zwloka" as string]: "2500ms" }}
      >
        Poznaj siebie.
        <br />
        Wybierz świadomie.
        <svg viewBox="0 0 180 14" className="mt-0.5 block h-3.5 w-[11rem]" fill="none">
          <path
            data-ruch
            d="M3 9c38-6 108-8 174-4"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="210"
            style={{
              ["--ruch" as string]: "podkreslenie",
              ["--czas" as string]: "900ms",
              ["--zwloka" as string]: "2700ms",
              ["--krzywa" as string]: "ease-out",
            }}
          />
        </svg>
      </p>

      <p className="absolute bottom-12 right-14 hidden text-drobne font-bold uppercase tracking-[0.22em] text-atrament-slaby lg:block">
        DreamWork
      </p>
    </main>
  );
}

/**
 * Iskry i pyłki rozchodzące się od znaku.
 *
 * Czysta ozdoba, więc `aria-hidden` i zero treści. Kąty i długości są wypisane,
 * a nie losowane: ten sam moduł ma wyglądać tak samo za każdym razem, a losowa
 * animacja przy powrocie do ekranu czyta się jak usterka.
 */
function Iskry() {
  const ISKRY = [
    { kat: 0, dlugosc: 46, kolor: "#1d5bff", czas: 1500, zwloka: 1000 },
    { kat: 26, dlugosc: 34, kolor: "#6d3df5", czas: 1400, zwloka: 1080 },
    { kat: 53, dlugosc: 52, kolor: "#b8460f", czas: 1600, zwloka: 1020 },
    { kat: 79, dlugosc: 38, kolor: "#1d5bff", czas: 1450, zwloka: 1130 },
    { kat: 104, dlugosc: 44, kolor: "#6d3df5", czas: 1550, zwloka: 1050 },
    { kat: 131, dlugosc: 30, kolor: "#b8460f", czas: 1380, zwloka: 1160 },
    { kat: 157, dlugosc: 48, kolor: "#1d5bff", czas: 1620, zwloka: 1010 },
    { kat: 184, dlugosc: 36, kolor: "#6d3df5", czas: 1420, zwloka: 1100 },
    { kat: 210, dlugosc: 50, kolor: "#b8460f", czas: 1580, zwloka: 1040 },
    { kat: 236, dlugosc: 32, kolor: "#1d5bff", czas: 1360, zwloka: 1170 },
    { kat: 263, dlugosc: 46, kolor: "#6d3df5", czas: 1520, zwloka: 1060 },
    { kat: 289, dlugosc: 40, kolor: "#b8460f", czas: 1460, zwloka: 1120 },
    { kat: 315, dlugosc: 54, kolor: "#1d5bff", czas: 1640, zwloka: 1000 },
    { kat: 341, dlugosc: 34, kolor: "#6d3df5", czas: 1400, zwloka: 1150 },
  ];
  const PYLKI = [
    { kat: 14, rozmiar: 5, kolor: "#6d3df5", czas: 2100, zwloka: 1060 },
    { kat: 96, rozmiar: 4, kolor: "#b8460f", czas: 2300, zwloka: 1140 },
    { kat: 172, rozmiar: 6, kolor: "#1d5bff", czas: 2000, zwloka: 1090 },
    { kat: 248, rozmiar: 4, kolor: "#6d3df5", czas: 2250, zwloka: 1200 },
    { kat: 324, rozmiar: 5, kolor: "#b8460f", czas: 2150, zwloka: 1120 },
  ];

  return (
    <span
      aria-hidden
      data-ruch
      data-ozdoba
      className="pointer-events-none absolute inset-0"
      style={{
        ["--ruch" as string]: "obrot",
        ["--czas" as string]: "30s",
        ["--powtorzenia" as string]: "infinite",
      }}
    >
      {ISKRY.map((i) => (
        <span
          key={`iskra-${i.kat}`}
          className="absolute left-1/2 top-1/2"
          style={{ transform: `rotate(${i.kat}deg)` }}
        >
          <span
            data-ruch
            className="-ml-px block w-0.5 rounded-sm"
            style={{
              height: i.dlugosc,
              background: `linear-gradient(to top, transparent, ${i.kolor})`,
              transformOrigin: "50% 100%",
              ["--ruch" as string]: "iskra",
              ["--czas" as string]: `${i.czas}ms`,
              ["--zwloka" as string]: `${i.zwloka}ms`,
            }}
          />
        </span>
      ))}
      {PYLKI.map((p) => (
        <span
          key={`pylek-${p.kat}`}
          className="absolute left-1/2 top-1/2"
          style={{ transform: `rotate(${p.kat}deg)` }}
        >
          <span
            data-ruch
            className="block rounded-full"
            style={{
              width: p.rozmiar,
              height: p.rozmiar,
              marginLeft: -p.rozmiar / 2,
              background: p.kolor,
              transformOrigin: "50% 100%",
              ["--ruch" as string]: "pylek",
              ["--czas" as string]: `${p.czas}ms`,
              ["--zwloka" as string]: `${p.zwloka}ms`,
            }}
          />
        </span>
      ))}
    </span>
  );
}
