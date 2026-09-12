/**
 * Rozbiór kart zawodów na bloki.
 *
 * Dwie rzeczy, które ten test pilnuje. Po pierwsze pokrycie: sekcje z danymi
 * mają się rozpoznać na wszystkich stu pięćdziesięciu siedmiu kartach, a nie
 * tylko na tych, na których pisano parser. Po drugie bezpieczeństwo: czego
 * parser nie rozpozna, to musi zostać markdownem, więc żadna karta nie może
 * stracić treści ani wyjść pusta.
 */

import { describe, expect, it, beforeAll } from "vitest";
import { prisma } from "@/lib/db/klient";
import { ulozKarte, rodzajSekcji, czytajObciazenie, type Blok, type SekcjaKarty } from "@/lib/karty/uklad";

interface Rozbita {
  kod: string;
  sekcje: SekcjaKarty[];
  bloki: Blok[];
}

let karty: Rozbita[] = [];

beforeAll(async () => {
  const wiersze = await prisma.karta.findMany();
  karty = wiersze.map((k) => {
    const sekcje = JSON.parse(k.sekcje) as SekcjaKarty[];
    return { kod: k.kod, sekcje, bloki: ulozKarte(sekcje) };
  });
});

function ile(rodzaj: Blok["rodzaj"]): number {
  return karty.filter((k) => k.bloki.some((b) => b.rodzaj === rodzaj)).length;
}

describe("pokrycie sześciu sekcji z danymi", () => {
  it("wszystkie sto pięćdziesiąt siedem kart daje się rozłożyć", () => {
    expect(karty).toHaveLength(157);
    for (const k of karty) expect(k.bloki.length, k.kod).toBeGreaterThan(0);
  });

  it("skala i obciążenie na każdej karcie, także na skróconych", () => {
    expect(ile("skala")).toBe(157);
    expect(ile("obciazenie")).toBe(157);
  });

  it("pieniądze, droga i zagrożenie na zdecydowanej większości", () => {
    expect(ile("pieniadze")).toBeGreaterThanOrEqual(145);
    expect(ile("droga")).toBeGreaterThanOrEqual(150);
    expect(ile("zagrozenie")).toBeGreaterThanOrEqual(130);
  });

  it("na co idzie czas jest sekcją rzadką i nie udajemy, że jest wszędzie", () => {
    // Dwadzieścia dziewięć kart. To brak treści w źródle, nie błąd parsera.
    expect(ile("czas")).toBeGreaterThanOrEqual(25);
    expect(ile("czas")).toBeLessThan(60);
  });
});

describe("nic nie przepada", () => {
  it("każdy blok markdown ma treść albo nie powstaje", () => {
    for (const k of karty) {
      for (const b of k.bloki) {
        if (b.rodzaj === "markdown") expect(b.tresc.trim().length, k.kod).toBeGreaterThan(0);
      }
    }
  });

  it("obciążenie ma zawsze co najmniej cztery wymiary z oceną od 1 do 5", () => {
    for (const k of karty) {
      for (const b of k.bloki) {
        if (b.rodzaj !== "obciazenie") continue;
        expect(b.wymiary.length, k.kod).toBeGreaterThanOrEqual(4);
        for (const w of b.wymiary) {
          expect(w.ocena, `${k.kod}: ${w.wymiar}`).toBeGreaterThanOrEqual(1);
          expect(w.ocena, `${k.kod}: ${w.wymiar}`).toBeLessThanOrEqual(5);
        }
      }
    }
  });

  it("znaczniki szacunku zostają: „≈” w skali, „○” w widełkach", () => {
    const zeSkala = karty.filter((k) =>
      k.bloki.some((b) => b.rodzaj === "skala" && b.liczby.some((l) => l.wartosc.includes("≈"))),
    );
    expect(zeSkala.length).toBeGreaterThanOrEqual(150);

    const zKwotami = karty.filter((k) =>
      k.bloki.some((b) => b.rodzaj === "pieniadze" && b.etapy.some((e) => e.kwota.includes("○"))),
    );
    expect(zKwotami.length).toBeGreaterThanOrEqual(140);
  });
});

describe("rozpoznanie po przedrostku, nie po pełnym tytule", () => {
  it("warianty tytułów trafiają w ten sam rodzaj", () => {
    expect(rodzajSekcji("Skala")).toBe("skala");
    expect(rodzajSekcji("Skala zawodu")).toBe("skala");
    expect(rodzajSekcji("Czy zagrożony")).toBe("zagrozenie");
    expect(rodzajSekcji("Czy ten zawód jest zagrożony w przyszłości")).toBe("zagrozenie");
    expect(rodzajSekcji("Droga dojścia, krok po kroku")).toBe("droga");
    expect(rodzajSekcji("Na co idzie czas")).toBe("czas");
    expect(rodzajSekcji("Na co realnie idzie czas")).toBe("czas");
  });

  it("skala międzynarodowa to osobna sekcja, nie skala zawodu", () => {
    expect(rodzajSekcji("Skala międzynarodowa")).toBeNull();
  });

  it("obciążenie czyta się tak samo z tabeli i z prozy", () => {
    const zTabeli = czytajObciazenie(
      [
        "| Wymiar | Ocena | Uzasadnienie |",
        "|---|:---:|---|",
        "| Fizyczne | 1 | Praca siedząca |",
        "| Psychiczne | 3 | Odpowiedzialność |",
        "| Presja czasu | 4 | Terminy |",
        "| Odpowiedzialność | 4 | Skutki finansowe |",
        "| Kontakt z ludźmi | 2 | Niski |",
        "| Nieprzewidywalność dnia | 1 | Przewidywalny |",
      ].join("\n"),
    );
    const zProzy = czytajObciazenie(
      "Fizyczne **1** · psychiczne **3** · presja czasu **4** · odpowiedzialność **4** · kontakt z ludźmi **2** · nieprzewidywalność **1**",
    );
    expect(zTabeli?.map((w) => w.ocena)).toEqual([1, 3, 4, 4, 2, 1]);
    expect(zProzy?.map((w) => w.ocena)).toEqual([1, 3, 4, 4, 2, 1]);
    expect(zProzy?.[1].wymiar).toBe("Psychiczne");
  });
});
