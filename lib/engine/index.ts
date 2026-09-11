/**
 * Zlozenie trzech warstw silnika.
 *
 * Czysta funkcja: dostaje wyniki modulow i baze referencyjna, zwraca komplet
 * wyniku. Nie dotyka bazy danych, nie renderuje niczego, nie ma efektow
 * ubocznych. Dzieki temu caly silnik jest testowalny bez bazy i bez UI.
 */

import { WERSJA_SILNIKA } from "./config";
import { trzyDrogi, ustawTekstyFiltrow, warstwa1 } from "./layer1-areas";
import { warstwa2, zasobyZPunktuStartu } from "./layer2-professions";
import { warstwa3 } from "./layer3-fields";
import { zakonczenieWedlugEtapu } from "./layer0-start";
import { poziomDocelowy, profilKartowy, wskaznikiJakosci } from "./profil";
import { FILTRY_A5 } from "../domain/slowniki";
import type { BazaReferencyjna, WynikiModulow, WynikSilnika } from "./typy";

ustawTekstyFiltrow(FILTRY_A5);

export function uruchomSilnik(w: WynikiModulow, baza: BazaReferencyjna): WynikSilnika {
  const wskazniki = wskaznikiJakosci(w);

  const w1 = warstwa1(w, baza.obszary, wskazniki);

  const wynikiObszarow = new Map(w1.obszary.map((o) => [o.id, o.wynik]));
  const profil = profilKartowy(w);
  const w2 = warstwa2(profil, wynikiObszarow, baza.zawody, baza.klastry, {
    poziomDocelowy: poziomDocelowy(w),
    zasoby: zasobyZPunktuStartu(w.punktStartu),
    punktStartu: w.punktStartu,
    usunieteObszary: w1.usuniete,
  });

  // Obszar, z ktorego weto usunelo wszystkie zawody, jest pusta obietnica.
  // Ta sama regula, ktora obowiazuje przy kierunkach: nie ma czego w nim
  // pokazac, wiec znika z rankingu i z trzech drog.
  //
  // Uwaga na asymetrie, ktora jest tu celowa: pojedyncze weto usuwa zawody,
  // nie caly obszar. Obszar szesnasty to nie tylko lekarz i ratownik, ale takze
  // farmaceuta i technik radiolog, o zupelnie innym kontakcie ze smiercia.
  // Dopiero gdy nie zostanie ani jeden zawod, obszar przestaje cokolwiek znaczyc.
  const obszaryZZawodami = new Set(baza.zawody.map((z) => z.obszar));
  const przetrwaly = new Set(w2.wszystkie.map((z) => z.obszar));
  const wetaObszaru = new Map<number, string[]>();
  for (const usuniety of w2.usunieteWetem) {
    const zawod = baza.zawody.find((z) => z.kod === usuniety.kod);
    if (zawod) wetaObszaru.set(zawod.obszar, usuniety.filtry);
  }

  const puste = w1.obszary.filter(
    (o) => obszaryZZawodami.has(o.id) && !przetrwaly.has(o.id),
  );
  if (puste.length > 0) {
    for (const o of puste) {
      const filtry = wetaObszaru.get(o.id);
      w1.usuniete.push({
        id: o.id,
        nazwa: o.nazwa,
        powod: filtry ? "weto" : "brak_zawodow",
        filtr: filtry?.[0],
        ciagniecie: o.ciagniecie,
      });
    }
    const puste_id = new Set(puste.map((o) => o.id));
    w1.obszary = w1.obszary.filter((o) => !puste_id.has(o.id));
    if (!w1.profilNieostry) {
      const przeliczone = trzyDrogi(
        w1.obszary.filter((o) => o.id !== 27),
        baza.obszary,
      );
      w1.drogi = przeliczone.drogi;
      w1.podobienstwa = przeliczone.podobienstwa;
      // Flagi z pierwszego przebiegu dotyczyly innego zestawu drog, wiec te,
      // ktore mowia o relacjach miedzy drogami, liczymy od nowa.
      const oDrogach = new Set([
        "droga_b_slabsza_od_a",
        "ten_sam_swiat_a_b",
        "nawet_alternatywa_blisko",
        "droga_c_jako_inny_poziom",
        "trzy_drogi_z_jednego_swiata",
      ]);
      w1.flagi = [...w1.flagi.filter((f) => !oDrogach.has(f)), ...przeliczone.flagi];
    }
  }

  // Kazda droga dostaje dwa do czterech konkretnych zawodow ze swojego obszaru.
  // Bez progu pokazania: droga bez ani jednego zawodu jest bezuzyteczna,
  // a pasmo opisowe i tak mowi uczciwie, jak mocne jest dopasowanie.
  //
  // Filtrujemy po poziomie wejscia drogi. Bez tego Droga C zbudowana jako inny
  // poziom w obszarze A dostawala te same cztery zawody co A i obie karty
  // wygladaly identycznie, mimo ze cala ich roznica to wlasnie poziom wejscia.
  for (const droga of w1.drogi) {
    const zObszaru = w2.wszystkie.filter((z) => z.obszar === droga.obszar);
    const zPoziomu = zObszaru.filter((z) => z.poziom === droga.poziom.poziom);
    droga.zawody = (zPoziomu.length > 0 ? zPoziomu : zObszaru).slice(0, 4).map((z) => z.kod);
  }

  const w3 = warstwa3(w2, baza.zawody, baza.kierunki, baza.drogiBezStudiow, {
    punktStartu: w.punktStartu,
  });

  return {
    wersjaSilnika: WERSJA_SILNIKA,
    wskazniki,
    warstwa1: w1,
    warstwa2: w2,
    warstwa3: w3,
    zakonczenie: zakonczenieWedlugEtapu(w.punktStartu),
    pytaniaNaSesje: pytaniaNaSesje(w, w1, w2, w3, baza),
  };
}

/**
 * Silnik nie konczy pracy na rankingu. Produkuje material do rozmowy.
 *
 * Kazda flaga, kazde weto o duzym zasiegu i kazda rozbieznosc miedzy modulami
 * zamienia sie w pytanie dla prowadzacego. To jest realizacja zasady z modelu
 * programu: sesja 1:1 ma byc poswiecona decyzji, nie ponownemu poznawaniu
 * uczestnika.
 */
function pytaniaNaSesje(
  w: WynikiModulow,
  w1: WynikSilnika["warstwa1"],
  w2: WynikSilnika["warstwa2"],
  w3: WynikSilnika["warstwa3"],
  baza: BazaReferencyjna,
): string[] {
  const pytania: string[] = [];
  const nazwaFiltru = new Map(FILTRY_A5.map((f) => [f.kod, f.tekst]));

  if (w1.profilNieostry) {
    pytania.push(
      "Profil zainteresowań jest jeszcze nieostry. Zacznij od ekspozycji: czego uczestnik po prostu nie miał okazji spróbować?",
    );
  }

  if (w1.flagi.includes("ten_sam_swiat_a_b")) {
    const [a, b] = w1.drogi;
    pytania.push(
      `Droga A (${a?.nazwaObszaru}) i Droga B (${b?.nazwaObszaru}) to w gruncie rzeczy ten sam świat. Co je dla Ciebie różni?`,
    );
  }
  if (w1.flagi.includes("droga_b_slabsza_od_a")) {
    pytania.push("Jedna droga wyszła wyraźnie mocniej niż pozostałe. Czy to zgadza się z Twoim odczuciem?");
  }
  if (w1.flagi.includes("droga_c_jako_inny_poziom")) {
    pytania.push(
      "Nie znalazła się sensowna trzecia droga w innym obszarze. Trzecia możliwość to te same drzwi, tylko inny poziom wejścia. Czy to jest dla Ciebie realna alternatywa?",
    );
  }

  // Weto o duzym zasiegu.
  const zasiegWeta = new Map<string, number>();
  for (const u of w1.usuniete) {
    if (u.powod === "weto" && u.filtr) zasiegWeta.set(u.filtr, (zasiegWeta.get(u.filtr) ?? 0) + 1);
  }
  for (const [filtr, ile] of zasiegWeta) {
    if (ile >= 2) {
      pytania.push(
        `Weto na „${nazwaFiltru.get(filtr) ?? filtr}" usunęło ${ile} obszarów. Czy to na pewno granica nie do przekroczenia?`,
      );
    }
  }

  // Sprzecznosc A1 z A5: ciagnie go do X, a wykluczyl warunek nieuchronny w X.
  for (const u of w1.usuniete) {
    if (u.powod !== "weto" || !u.filtr) continue;
    const obszar = baza.obszary.find((o) => o.id === u.id);
    if (!obszar) continue;
    const sumaWag = Object.values(obszar.zainteresowania).reduce((s, v) => s + v, 0);
    const ciagniecie =
      sumaWag > 0
        ? Object.entries(obszar.zainteresowania).reduce(
            (s, [id, waga]) => s + waga * (w.z[Number(id)] ?? 45),
            0,
          ) / sumaWag
        : 0;
    if (ciagniecie >= 60) {
      pytania.push(
        `Ciągnie Cię do obszaru „${u.nazwa}", a wykluczyłeś warunek, którego w nim nie da się uniknąć: ${nazwaFiltru.get(u.filtr) ?? u.filtr}. Które z tych dwóch jest twardsze?`,
      );
    }
  }

  // Ukryty atut na odwrot: dasz rade, ale po co.
  for (const a of w1.antydopasowania) {
    if (a.powod === "dasz_rade_ale_po_co") {
      pytania.push(`Obszar „${a.nazwa}" wyszedł mocno w kompetencjach, a słabo w zainteresowaniach. Skąd ta różnica?`);
    }
  }

  // Bariera kosztowa w czolowce.
  const zBariera = w2.pozycje.slice(0, 5).flatMap((p) => p.zawody).filter((z) => z.flagi.barieraKosztowa);
  if (zBariera.length > 0) {
    pytania.push(
      `Droga do zawodu ${zBariera[0].nazwa} kosztuje. Sprawdźcie, czy są sposoby finansowania i czy uczestnik chce ją utrzymać.`,
    );
  }

  // Klaster w czolowce: pytanie rozstrzygajace wprost z bazy.
  for (const p of w2.pozycje.slice(0, 5)) {
    if (p.typ === "klaster" && p.pytanieRozstrzygajace) pytania.push(p.pytanieRozstrzygajace);
  }

  // Ostrzezenia antyprofilowe w czolowce.
  for (const p of w2.pozycje.slice(0, 5)) {
    for (const z of p.zawody) {
      for (const o of z.ostrzezenia.slice(0, 1)) {
        pytania.push(`${z.nazwa}: ${o.zdanie}`);
      }
    }
  }

  if (w2.wynikiWstepne) {
    pytania.push(
      "Mniej niż pięć zawodów przekroczyło próg pokazania. Wynik jest wstępny — sprawdź, czy któryś moduł nie został wypełniony pobieżnie.",
    );
  }
  if (w3.sensStudiow === "niepotrzebne") {
    pytania.push(
      "Większość dróg tego uczestnika nie wymaga studiów. Sprawdź, czy to nie koliduje z oczekiwaniami rodziny.",
    );
  }

  return [...new Set(pytania)];
}

export * from "./typy";
export { WERSJA_SILNIKA } from "./config";
