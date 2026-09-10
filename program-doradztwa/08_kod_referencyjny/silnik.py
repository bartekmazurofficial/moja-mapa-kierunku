# -*- coding: utf-8 -*-
import importlib.util, io, sys, math, re

spec = importlib.util.spec_from_file_location("ext", "/home/claude/a1/obszary_ext.py")
ext = importlib.util.module_from_spec(spec)
buf = io.StringIO(); old = sys.stdout; sys.stdout = buf
spec.loader.exec_module(ext); sys.stdout = old
O, A1, A2, A4V, F, M1D = ext.O, ext.A1, ext.A2, ext.A4V, ext.F, ext.M1D
POZ, SIM, SAMOZ = ext.POZ, ext.SIM, ext.SAMOZ

TWARDE = {"MIE", "GOD", "KOR"}          # parametry zycia o duzej konsekwencji
BONUS_MAX = 15.0                        # LICZBA DECYZYJNA 1
MNOZ_MIN, MNOZ_MAX = 0.65, 1.15         # LICZBA DECYZYJNA 2
PROG_WETA = 0.60
SUFIT_KARY = 0.50
PROG_DROGI = 0.45


def lata(txt):
    m = re.match(r"\s*(\d+)", txt)
    return float(m.group(1)) if m else 0.0


def poziomy_dostepne(i, G):
    out = []
    for lab, ex, t, st in POZ[i]:
        y = lata(t)
        wymaga_studiow = st.startswith("tak")
        dlugie = y >= 5
        if wymaga_studiow and G.get("F02", 1.0) == 0.0:
            continue
        if dlugie and G.get("F01", 1.0) == 0.0:
            continue
        out.append((lab, ex, t, st, y))
    return out


def wybierz_poziom(dost, inw):
    if not dost:
        return None
    if inw is not None and inw >= 75:      # szybkie wejscie
        return min(dost, key=lambda p: p[4])
    if inw is not None and inw <= 25:      # dluga inwestycja
        return max(dost, key=lambda p: p[4])
    return sorted(dost, key=lambda p: p[4])[len(dost) // 2]


def silnik(prof):
    Z, K, G = prof["Z"], prof["K"], prof["G"]
    top5v, bot3v, prog = prof["top5v"], prof["bot3v"], prof["progowe"]
    weta, shape, dowody = prof["weta"], prof["shape"], prof.get("dowody", set())
    wyniki, usuniete = [], []

    for i, o in O.items():
        # --- ETAP 0: wykonalnosc ---
        veto_hit = [p for p in weta if o["filtry"].get(p, 0) >= PROG_WETA]
        if veto_hit:
            usuniete.append((i, "weto:" + veto_hit[0]))
            continue
        sw = sum(o["filtry"].values())
        kara = sum(v * (1 - G.get(k, 0.5)) for k, v in o["filtry"].items()) / sw if sw else 0
        wykonalnosc = 1 - SUFIT_KARY * kara

        # --- ETAP 1: ciagniecie ---
        sz = sum(o["zaint"].values())
        ciag = sum(v * Z.get(a, 50) for a, v in o["zaint"].items()) / sz

        # --- ETAP 2: wzmocnienie, tylko w gore ---
        sk = sum(o["komp"].values())
        komp = sum(v * K.get(c, 50) for c, v in o["komp"].items()) / sk
        bonus = max(0.0, komp - 50) / 50 * (BONUS_MAX - 3)
        rdzen = [c for c, v in o["komp"].items() if v == 3]
        if rdzen and sum(1 for c in rdzen if c in dowody) >= max(1, len(rdzen) // 2):
            bonus += 3
        bonus = min(bonus, BONUS_MAX)

        # --- ETAP 3: mnoznik zgodnosci ---
        d = 0.0
        for v in o["wart_plus"]:
            if v in top5v:
                d += 0.04
        for v in o["wart_minus"]:
            if v in prog:
                d -= 0.25
            elif v in top5v:
                d -= 0.10
            elif v in bot3v:
                d += 0.02
        wspolne = [(dim, s) for dim, s in o["zycie"].items() if shape.get(dim) is not None]
        if wspolne:
            dyst = []
            for dim, s in wspolne:
                cel = 100 if s == "A" else 0
                dd = abs(shape[dim] - cel) / 100
                dyst.append(dd)
                if dim in TWARDE and dd == 1.0:
                    d -= 0.08
            d -= 0.20 * (sum(dyst) / len(dyst))
        mnoznik = max(MNOZ_MIN, min(MNOZ_MAX, 1.0 + d))

        # --- ETAP 4: wynik ---
        wynik = (ciag + bonus) * mnoznik * wykonalnosc

        # --- ETAP 5: poziom wejscia ---
        dost = poziomy_dostepne(i, G)
        poziom = wybierz_poziom(dost, shape.get("INW"))
        if poziom is None:
            usuniete.append((i, "brak dostepnego poziomu edukacyjnego"))
            continue

        wyniki.append(dict(id=i, nazwa=o["name"], wynik=wynik, ciag=ciag, komp=komp,
                           bonus=bonus, mnoznik=mnoznik, wykonalnosc=wykonalnosc,
                           poziom=poziom[0], przyklad=poziom[1], czas=poziom[2]))

    wyniki.sort(key=lambda r: (-r["wynik"], -r["ciag"], r["id"]))
    return wyniki, usuniete


PROG_B = 0.55        # LICZBA DECYZYJNA 3: minimalna jakosc Drogi B (ulamek wyniku A)
PROG_C = 0.40        # LICZBA DECYZYJNA 4: minimalna jakosc Drogi C
PROG_BLISKO = 0.60   # powyzej tego A i B to "ten sam swiat"

def trzy_drogi(wyniki):
    """A = najmocniejsze. B = drugie najmocniejsze (jakosc).
       C = najbardziej odmienne sposrod sensownych (alternatywa)."""
    if not wyniki:
        return [], []
    A = wyniki[0]
    drogi, flagi = [A], []
    kand_b = [r for r in wyniki[1:] if r["wynik"] >= PROG_B * A["wynik"]]
    if not kand_b:
        kand_b = wyniki[1:2]
        flagi.append("Droga B wyraznie slabsza od A")
    if not kand_b:
        return drogi, flagi
    B = kand_b[0]
    drogi.append(B)
    if SIM[A["id"]].get(B["id"], 1) >= PROG_BLISKO:
        flagi.append("A i B to ten sam swiat (%.2f) - roznia sie drzwiami, nie kierunkiem"
                     % SIM[A["id"]][B["id"]])
    kand_c = [r for r in wyniki[1:] if r["id"] != B["id"]
              and r["wynik"] >= PROG_C * A["wynik"]]
    if kand_c:
        C = min(kand_c, key=lambda r: (max(SIM[A["id"]].get(r["id"], 1),
                                           SIM[B["id"]].get(r["id"], 1)),
                                       -r["wynik"]))
        drogi.append(C)
        if max(SIM[A["id"]].get(C["id"], 1), SIM[B["id"]].get(C["id"], 1)) >= PROG_BLISKO:
            flagi.append("nawet najodleglejsza alternatywa jest blisko A lub B - profil bardzo waski")
    else:
        flagi.append("brak sensownej trzeciej drogi")
    return drogi, flagi


def pusty(default, n):
    return {i: default for i in range(1, n + 1)}


def profil(nazwa, zain, komp, top5v, bot3v, prog, odp, weta, shape, dowody):
    Z = pusty(45, 24); Z.update(zain)
    K = pusty(45, 30); K.update(komp)
    G = {f: 0.5 for f in F}; G.update(odp)
    return dict(nazwa=nazwa, Z=Z, K=K, G=G, top5v=top5v, bot3v=bot3v,
                progowe=prog, weta=weta, shape=shape, dowody=dowody)


P1 = profil("RZEMIEŚLNIK — 17 lat",
 {1: 92, 2: 88, 22: 74, 4: 66, 5: 58, 15: 22, 16: 25, 10: 20, 14: 28, 17: 30, 13: 30},
 {26: 88, 27: 85, 1: 78, 22: 72, 25: 70, 23: 66, 11: 25, 13: 22, 16: 35},
 ["WOL", "MIS", "STA", "PIE", "CZA"], ["UZN", "WPL", "ZMI"], ["WOL"],
 {"F01": 0.0, "F02": 0.0, "F16": 1.0, "F18": 1.0, "F17": 1.0, "F20": 1.0,
  "F19": 0.0, "F22": 0.5, "F26": 0.0, "F29": 1.0, "F12": 0.5, "F11": 0.5},
 {"F26"},
 {"MIE": 100, "ORG": 0, "INW": 100, "KOR": 100, "CEN": 25, "GOD": 75,
  "POZ": 50, "LUD": 25, "WID": 0, "GRA": 50, "TEMP": 50, "ROD": None},
 {26, 27, 1})

P2 = profil("SPOŁECZNA — 19 lat",
 {13: 90, 15: 88, 14: 80, 16: 76, 7: 62, 8: 22, 5: 20, 1: 18, 23: 25, 21: 32},
 {17: 84, 16: 82, 12: 78, 18: 74, 19: 70, 3: 28, 27: 25, 10: 30, 28: 35},
 ["SEN", "REL", "ZAS", "CZA", "STA"], ["PIE", "UZN", "ZMI"], ["SEN"],
 {"F01": 0.5, "F02": 1.0, "F21": 0.0, "F12": 0.5, "F22": 1.0, "F24": 1.0,
  "F23": 1.0, "F19": 0.5, "F16": 0.5, "F28": 0.0, "F26": 0.5},
 {"F21"},
 {"GOD": 0, "CEN": 0, "ORG": 25, "MIE": 75, "INW": 25, "KOR": 75,
  "POZ": 25, "LUD": 25, "WID": 25, "GRA": 0, "TEMP": 25, "ROD": 75},
 {17, 16, 12})

P3 = profil("ANALITYK — 22 lata",
 {8: 92, 5: 84, 6: 80, 22: 70, 21: 64, 13: 20, 15: 18, 4: 22, 11: 25, 12: 20},
 {2: 88, 4: 86, 3: 82, 1: 80, 6: 76, 22: 70, 13: 25, 28: 22, 19: 30},
 ["ROZ", "MIS", "PIE", "WOL", "STA"], ["UZN", "REL", "SEN"], ["ROZ"],
 {"F01": 1.0, "F02": 1.0, "F19": 1.0, "F04": 1.0, "F22": 0.5, "F16": 0.0,
  "F17": 0.0, "F21": 0.0, "F12": 0.0, "F11": 0.0, "F27": 1.0},
 set(),
 {"MIE": 0, "GRA": 100, "INW": 0, "ORG": 50, "CEN": 75, "GOD": 75,
  "KOR": 25, "POZ": 75, "LUD": 25, "WID": 25, "TEMP": 75, "ROD": None},
 {2, 4, 3})

for prof in (P1, P2, P3):
    wyn, usun = silnik(prof)
    print("=" * 74)
    print(prof["nazwa"])
    print("=" * 74)
    print("TOP 6:")
    for r in wyn[:6]:
        print("  %5.1f  %-38s [%s: %s, %s]" %
              (r["wynik"], r["nazwa"], r["poziom"], r["przyklad"], r["czas"]))
    print("  ...")
    print("NAJNIŻEJ:")
    for r in wyn[-3:]:
        print("  %5.1f  %s" % (r["wynik"], r["nazwa"]))
    print("USUNIĘTE (%d): %s" % (len(usun),
          ", ".join("%s [%s]" % (O[i]["name"], p) for i, p in usun[:5])))
    d, flagi = trzy_drogi(wyn)
    print("TRZY DROGI:")
    for lab, r in zip("ABC", d):
        print("  %s: %-36s  %.1f  (%s: %s)" %
              (lab, r["nazwa"], r["wynik"], r["poziom"], r["przyklad"]))
    if len(d) >= 2:
        print("  podobieństwo A–B: %.2f" % SIM[d[0]["id"]][d[1]["id"]])
    if len(d) == 3:
        print("  podobieństwo A–C: %.2f   B–C: %.2f" %
              (SIM[d[0]["id"]][d[2]["id"]], SIM[d[1]["id"]][d[2]["id"]]))
    if flagi:
        print("  FLAGI: " + "; ".join(flagi))
    print()
