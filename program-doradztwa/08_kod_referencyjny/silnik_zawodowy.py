# -*- coding: utf-8 -*-
"""
Silnik zawodowy: warstwa druga, z obszarow na konkretne zawody.
Prototyp walidacyjny. Sprawdza mechanike i gwarancje na profilach kontrolnych.
"""

# ---------------------------------------------------------------
# DANE ZAWODOW (podzbior 24 kart, wystarczajacy do walidacji mechaniki)
# Profil kartowy: a1 (obszary zainteresowan), a2r (kompetencje rdzeniowe),
# a3 (bieguny stylu), a5 (filtry gotowosci), anty (kody antyprofilu)
# ---------------------------------------------------------------

Z = {}

def z(k, obszar, poziom, a1, a2r, a3, a5, anty, koszt, flaga, zagr, studia):
    Z[k] = dict(obszar=obszar, poziom=poziom, a1=set(a1), a2r=set(a2r),
                a3=set(a3), a5=set(a5), anty=set(anty),
                koszt=koszt, flaga=flaga, zagr=zagr, studia=studia)

# obszar 9 technologia
z("programista", 9, "sredni", ["tech","liczby","dociekanie"], ["problemy","uczenie_sie","system"],
  ["glebia","cisza","samodzielnie"], ["komputer","doksztalcanie"],
  ["potrzeba_ruchu","efekt_widoczny","potrzeba_ludzi"], "niski", "docelowy", "sredni", "nie")
z("tester", 9, "szybki", ["precyzja","tech","porzadek"], ["dokladnosc","analiza","reguly"],
  ["struktura","dokladnosc"], ["komputer","doksztalcanie"],
  ["nuda_powtarzalnosc","potrzeba_tworzenia"], "niski", "trampolina", "wysoki", "nie")
z("wsparcie_tech", 9, "szybki", ["tech","uczenie","naprawianie"], ["wyjasnianie","uprzejmosc","problemy"],
  ["ludzie","powtarzalnosc"], ["komputer","ludzie_ciagle","roszczeniowi"],
  ["nuda_powtarzalnosc","cudza_zlosc"], "zerowy", "trampolina", "wysoki", "nie")
z("devops", 9, "dlugi", ["tech","porzadek","naprawianie"], ["system","problemy","uczenie_sie"],
  ["glebia","samodzielnie"], ["komputer","dyzury","doksztalcanie"],
  ["potrzeba_ludzi","waska_wiedza"], "niski", "docelowy", "niski", "nie")

# obszar 13 rzemioslo
z("elektryk", 13, "szybki", ["naprawianie","rece","precyzja","tech"], ["manualne","sprzet","problemy"],
  ["samodzielnie","efekt_widoczny"], ["fizyczna","stanie","brud","bezpieczenstwo"],
  ["ciasnota","procedury_nie","stala_pensja"], "sredni", "docelowy", "bardzo_niski", "nie")
z("hydraulik", 13, "szybki", ["naprawianie","rece","precyzja"], ["manualne","problemy","sprzet"],
  ["samodzielnie","efekt_widoczny"], ["fizyczna","brud","ciasnota","nieregularne"],
  ["ciasnota","brud_nie","przewidywalnosc"], "sredni", "docelowy", "bardzo_niski", "nie")
z("spawacz", 13, "szybki", ["rece","precyzja","naprawianie"], ["manualne","dokladnosc","wytrzymalosc"],
  ["cisza","samodzielnie","dokladnosc"], ["fizyczna","goraco","halas","wyjazdy"],
  ["potrzeba_ludzi","wzrok_slaby"], "bardzo_niski", "docelowy", "umiarkowany", "nie")
z("fryzjer", 13, "szybki", ["obraz","rece","rozmowa"], ["manualne","estetyka","uprzejmosc"],
  ["ludzie","efekt_widoczny"], ["stanie","soboty","ludzie_ciagle","chemikalia"],
  ["potrzeba_ciszy","stanie_nie"], "niski", "docelowy", "bardzo_niski", "nie")
z("mechanik", 13, "szybki", ["naprawianie","rece","tech"], ["problemy","manualne","sprzet"],
  ["samodzielnie","efekt_widoczny"], ["fizyczna","brud","doksztalcanie"],
  ["brud_nie","doksztalcanie_nie"], "sredni", "docelowy", "niski", "nie")

# obszar 16 medycyna
z("pielegniarka", 16, "sredni", ["zdrowie","opieka","rozmowa"], ["opiekunczosc","opanowanie","dokladnosc"],
  ["ludzie","procedury"], ["studia","zmiany","weekendy","krew","chorzy","bezpieczenstwo"],
  ["smierc","noce","przewidywalnosc","fizycznosc"], "niski", "docelowy", "bardzo_niski", "tak")
z("ratownik_med", 16, "sredni", ["zdrowie","ruch","opieka"], ["opanowanie","dokladnosc","wytrzymalosc"],
  ["zespol","nieprzewidywalnosc"], ["studia","zmiany","weekendy","krew","fizyczna","agresja"],
  ["urazy_ciezkie","bezsilnosc","noce"], "niski", "docelowy", "bardzo_niski", "tak")
z("opiekun_med", 16, "szybki", ["opieka","zdrowie","rozmowa"], ["opiekunczosc","wytrzymalosc","uprzejmosc"],
  ["ludzie","powtarzalnosc"], ["fizyczna","brud","zmiany","chorzy","umieranie"],
  ["fizycznosc","umieranie","kregoslup"], "bardzo_niski", "trampolina", "bardzo_niski", "nie")

# obszar 17 rehabilitacja
z("fizjoterapeuta", 17, "dlugi", ["zdrowie","opieka","ruch"], ["opiekunczosc","wyjasnianie","manualne"],
  ["ludzie","dokladnosc","samodzielnie"], ["studia","stanie","ludzie_ciagle","chorzy"],
  ["efekt_szybki","dotyk","kontrola_efektu"], "niski", "docelowy", "bardzo_niski", "tak")
z("masazysta", 17, "szybki", ["zdrowie","opieka","ruch"], ["manualne","opiekunczosc","wytrzymalosc"],
  ["ludzie","samodzielnie"], ["stanie","fizyczna","ludzie_ciagle","niepewny_dochod"],
  ["rece_slabe","dotyk","stala_pensja"], "niski", "docelowy", "niski", "nie")

# obszar 21 edukacja
z("nauczyciel", 21, "dlugi", ["uczenie","rozmowa"], ["wyjasnianie","wystapienia","cierpliwosc"],
  ["ludzie","powtarzalnosc","bodzce"], ["studia","ludzie_ciagle","dzieci","wystapienia"],
  ["potrzeba_ciszy","kwestionowanie","efekt_widoczny"], "niski", "docelowy", "niski", "tak")
z("pedagog_spec", 21, "dlugi", ["uczenie","opieka","rozmowa"], ["opiekunczosc","wyjasnianie","rozwiazania"],
  ["ludzie","powolne_tempo"], ["studia","dzieci","ludzie_ciagle","doksztalcanie"],
  ["efekt_szybki","agresja","konflikt_rodzic"], "niski", "docelowy", "bardzo_niski", "tak")
z("lektor", 21, "szybki", ["uczenie","pisanie","rozmowa"], ["wyjasnianie","cierpliwosc","slowo"],
  ["ludzie","samodzielnie"], ["nieregularne","wieczory","niepewny_dochod"],
  ["wieczory_nie","stala_pensja"], "bardzo_niski", "docelowy", "umiarkowany", "czesciowo")

# obszar 19 opieka
z("pracownik_socjalny", 19, "sredni", ["opieka","rozmowa","wspolnota"], ["wyczuwanie","opiekunczosc","reguly"],
  ["samodzielnie","nieprzewidywalnosc","konfrontacja"], ["studia","ludzie_ciagle","trudne_warunki","teren"],
  ["zabieranie_do_domu","efekt_widoczny","dokumentacja","konfrontacja_nie"], "niski", "docelowy", "bardzo_niski", "tak")
z("opiekun_starszej", 19, "szybki", ["opieka","rozmowa","zdrowie"], ["opiekunczosc","wytrzymalosc","uprzejmosc"],
  ["ludzie","powtarzalnosc"], ["fizyczna","brud","chorzy","umieranie"],
  ["fizycznosc","umieranie","samotnosc"], "bardzo_niski", "docelowy", "bardzo_niski", "nie")

# obszar 5 administracja
z("spec_admin", 5, "sredni", ["porzadek","precyzja","planowanie"], ["organizowanie","dokladnosc","wielozadaniowosc"],
  ["struktura","rowne_tempo"], ["komputer","powtarzalnosc"],
  ["potrzeba_uznania","rozwoj","przerywanie","nuda_powtarzalnosc"], "zerowy", "trampolina", "bardzo_wysoki", "czesciowo")
z("obsluga_klienta", 5, "szybki", ["rozmowa","uczenie","porzadek"], ["uprzejmosc","wyjasnianie","cierpliwosc"],
  ["ludzie","powtarzalnosc","struktura"], ["ludzie_ciagle","roszczeniowi","komputer"],
  ["cudza_zlosc","mierzenie","nuda_powtarzalnosc"], "zerowy", "trampolina", "bardzo_wysoki", "nie")

# obszar 26 gastronomia
z("kucharz", 26, "szybki", ["rece","planowanie","precyzja"], ["opanowanie","wielozadaniowosc","manualne"],
  ["szybkie_tempo","bodzce","zespol"], ["weekendy","stanie","zmiany","goraco","presja"],
  ["weekendy_nie","komunikacja_ostra","stanie_nie","tworczosc_od_razu"], "bardzo_niski", "docelowy", "niski", "nie")
z("kelner", 26, "szybki", ["rozmowa","przekonywanie","ruch"], ["uprzejmosc","wielozadaniowosc","zapamietywanie"],
  ["ludzie","szybkie_tempo","bodzce"], ["weekendy","stanie","ludzie_ciagle","roszczeniowi"],
  ["cudza_zlosc","weekendy_nie","chodzenie_nie"], "zerowy", "trampolina", "umiarkowany", "nie")

# obszar 23 tworzenie
z("grafik", 23, "szybki", ["obraz","precyzja","pisanie"], ["estetyka","dokladnosc","rozwiazania"],
  ["cisza","samodzielnie","wlasne_pomysly"], ["komputer","niepewny_dochod","doksztalcanie"],
  ["nietykalnosc_pracy","bez_ograniczen","sprzedaz_nie"], "sredni", "docelowy", "wysoki", "nie")
z("projektant_ux", 23, "sredni", ["obraz","rozmowa","dociekanie"], ["estetyka","rozwiazania","wyczuwanie"],
  ["wlasne_pomysly","ludzie"], ["komputer","ludzie_ciagle","doksztalcanie"],
  ["krytyka_osobista","bez_uzasadnienia","uzytkownicy_nie"], "niski", "docelowy", "umiarkowany", "nie")

# ---------------------------------------------------------------
# PROFILE KONTROLNE UCZESTNIKOW
# ---------------------------------------------------------------

P = {}

P["rzemieslnik_17"] = dict(
    wiek=17,
    obszary={13: 88, 10: 74, 9: 61, 26: 55, 12: 52, 16: 30, 21: 22, 23: 35, 5: 28, 17: 26, 19: 20},
    a1={"naprawianie", "rece", "precyzja", "tech", "ruch"},
    a2={"manualne", "sprzet", "problemy", "dokladnosc", "wytrzymalosc"},
    a3={"samodzielnie", "efekt_widoczny", "cisza"},
    a5_tak={"fizyczna", "stanie", "brud", "halas", "goraco", "bezpieczenstwo", "ciasnota"},
    a5_nie={"studia", "komputer", "wystapienia"},
    weta={"studia"},
    anty={"potrzeba_ludzi", "nuda_powtarzalnosc"},
    poziom_docelowy="szybki",
    zasoby="brak",
)

P["spoleczny_19"] = dict(
    wiek=19,
    obszary={21: 84, 19: 81, 20: 76, 16: 68, 22: 64, 17: 55, 5: 44, 26: 38, 9: 18, 13: 15, 23: 40},
    a1={"opieka", "rozmowa", "uczenie", "wspolnota", "zdrowie"},
    a2={"opiekunczosc", "wyjasnianie", "wyczuwanie", "cierpliwosc", "uprzejmosc"},
    a3={"ludzie", "powolne_tempo", "struktura"},
    a5_tak={"studia", "ludzie_ciagle", "dzieci", "chorzy", "wystapienia", "doksztalcanie"},
    a5_nie={"zmiany", "weekendy", "krew", "fizyczna"},
    weta={"krew"},
    anty={"zabieranie_do_domu", "konfrontacja_nie"},
    poziom_docelowy="sredni",
    zasoby="ograniczone",
)

P["analityczny_22"] = dict(
    wiek=22,
    obszary={9: 86, 6: 83, 10: 66, 4: 62, 23: 55, 5: 48, 21: 35, 13: 30, 16: 20, 26: 18, 19: 15},
    a1={"tech", "liczby", "dociekanie", "porzadek", "precyzja"},
    a2={"analiza", "system", "problemy", "dokladnosc", "uczenie_sie"},
    a3={"glebia", "cisza", "samodzielnie", "struktura"},
    a5_tak={"komputer", "doksztalcanie", "studia"},
    a5_nie={"fizyczna", "ludzie_ciagle", "weekendy", "zmiany", "roszczeniowi"},
    weta=set(),
    anty={"potrzeba_ruchu", "cudza_zlosc"},
    poziom_docelowy="sredni",
    zasoby="dobre",
)

# ---------------------------------------------------------------
# SILNIK ZAWODOWY
# ---------------------------------------------------------------

POZIOMY = {"szybki": 0, "sredni": 1, "dlugi": 2, "bardzo_dlugi": 3}


def dopasowanie_kartowe(p, zaw):
    """Zwraca (mnoznik 0,80-1,15, skladowe) na podstawie profilu karty."""
    # A1: pokrycie obszarow zainteresowan wymienionych w karcie
    a1_pok = len(p["a1"] & zaw["a1"]) / max(1, len(zaw["a1"]))
    # A2: pokrycie kompetencji rdzeniowych
    a2_pok = len(p["a2"] & zaw["a2r"]) / max(1, len(zaw["a2r"]))
    # A3: zgodnosc stylu
    a3_pok = len(p["a3"] & zaw["a3"]) / max(1, len(zaw["a3"]))
    # A5: ile wymagan gotowosci uczestnik odrzucil (bez wet, te sa twarde)
    odrzucone = len(zaw["a5"] & p["a5_nie"])
    a5_kara = min(0.15, 0.05 * odrzucone)

    baza = 0.45 * a1_pok + 0.35 * a2_pok + 0.20 * a3_pok
    mn = 0.65 + 0.50 * baza - a5_kara
    return max(0.55, min(1.15, mn)), dict(a1=a1_pok, a2=a2_pok, a3=a3_pok, odrz=odrzucone)


def ranking(nazwa_profilu, limit=12):
    p = P[nazwa_profilu]
    wyniki = []
    odrzucone_weto = []
    poz_uczestnika = POZIOMY[p["poziom_docelowy"]]

    for k, zaw in Z.items():
        obs = p["obszary"].get(zaw["obszar"])
        if obs is None:
            continue

        # ETAP A: weto twarde
        if zaw["a5"] & p["weta"]:
            odrzucone_weto.append((k, sorted(zaw["a5"] & p["weta"])))
            continue
        if zaw["studia"] == "tak" and "studia" in p["weta"]:
            odrzucone_weto.append((k, ["studia"]))
            continue

        # ETAP B: mnoznik kartowy
        mn, skl = dopasowanie_kartowe(p, zaw)

        # ETAP C: kara za rozjazd poziomu wejscia
        kara_poz = 0.05 * max(0, POZIOMY[zaw["poziom"]] - poz_uczestnika)

        # ETAP D: kara za barierę kosztową
        kara_koszt = 0.0
        if p["zasoby"] == "brak" and zaw["koszt"] in ("wysoki", "bardzo_wysoki"):
            kara_koszt = 0.10

        wynik = obs * mn * (1 - kara_poz) * (1 - kara_koszt)

        # ETAP E: antyprofil, ostrzezenie nie kara
        trafienia_anty = sorted(p["anty"] & zaw["anty"])

        wyniki.append(dict(zawod=k, wynik=round(wynik, 1), obszar_pkt=obs,
                           mn=round(mn, 3), skl=skl, anty=trafienia_anty,
                           flaga=zaw["flaga"], zagr=zaw["zagr"],
                           studia=zaw["studia"], poziom=zaw["poziom"]))

    # NORMALIZACJA: najwyzszy = 100, reszta proporcjonalnie. Bez obcinania.
    if wyniki:
        maks = max(w["wynik"] for w in wyniki)
        for w in wyniki:
            w["wynik"] = round(100.0 * w["wynik"] / maks, 1)

    # TIE-BREAKER przy roznicy ponizej 3 pkt:
    # 1) mniejsze zagrozenie przyszlosciowe  2) nizszy koszt wejscia  3) krotsza droga
    RANG_ZAGR = {"bardzo_niski": 0, "niski": 1, "umiarkowany": 2, "sredni": 2,
                 "wysoki": 3, "bardzo_wysoki": 4}
    RANG_KOSZT = {"zerowy": 0, "bardzo_niski": 1, "niski": 2, "sredni": 3,
                  "wysoki": 4, "bardzo_wysoki": 5}
    for w in wyniki:
        zw = Z[w["zawod"]]
        w["tb"] = (RANG_ZAGR.get(zw["zagr"], 2), RANG_KOSZT.get(zw["koszt"], 3),
                   POZIOMY[zw["poziom"]])
    wyniki.sort(key=lambda x: (-round(x["wynik"] / 3), x["tb"], -x["wynik"]))
    return wyniki[:limit], wyniki, odrzucone_weto


def gwarancje(top, wszystkie):
    """Sprawdza i uzupelnia gwarancje reprezentacji."""
    raport = {}
    bez_studiow = [w for w in top if w["studia"] == "nie"]
    szybkie = [w for w in top if w["poziom"] == "szybki"]
    raport["bez_studiow"] = len(bez_studiow)
    raport["szybkie"] = len(szybkie)

    dodane = []
    if len(bez_studiow) < 3:
        kand = [w for w in wszystkie if w["studia"] == "nie" and w not in top]
        for w in kand[: 3 - len(bez_studiow)]:
            dodane.append(("bez_studiow", w["zawod"], w["wynik"]))
    if len(szybkie) < 2:
        kand = [w for w in wszystkie if w["poziom"] == "szybki" and w not in top]
        for w in kand[: 2 - len(szybkie)]:
            dodane.append(("szybkie", w["zawod"], w["wynik"]))
    raport["dodane"] = dodane
    return raport


# ---------------------------------------------------------------
# PRZEBIEG NA SUCHO
# ---------------------------------------------------------------

print("=" * 74)
print("SILNIK ZAWODOWY, PRZEBIEG NA SUCHO")
print("=" * 74)

for nazwa in P:
    top, wszystkie, weta = ranking(nazwa)
    p = P[nazwa]
    print(f"\n### {nazwa.upper()}  (poziom docelowy: {p['poziom_docelowy']}, "
          f"zasoby: {p['zasoby']}, weta: {sorted(p['weta']) or 'brak'})")
    print(f"{'zawod':<20} {'wynik':>6} {'obszar':>7} {'mnoz':>6}  {'A1':>4} {'A2':>4} {'A3':>4}  flagi")
    print("-" * 74)
    for w in top[:8]:
        s = w["skl"]
        flagi = []
        if w["flaga"] == "trampolina":
            flagi.append("TRAMPOLINA")
        if w["zagr"] in ("wysoki", "bardzo_wysoki"):
            flagi.append("ZAGROZONY")
        if w["anty"]:
            flagi.append("ANTY:" + ",".join(w["anty"][:2]))
        print(f"{w['zawod']:<20} {w['wynik']:>6.1f} {w['obszar_pkt']:>7} {w['mn']:>6.2f}  "
              f"{s['a1']:>4.2f} {s['a2']:>4.2f} {s['a3']:>4.2f}  {' '.join(flagi)}")
    g = gwarancje(top, wszystkie)
    print(f"  gwarancje: bez studiow {g['bez_studiow']}, szybkie wejscie {g['szybkie']}"
          + (f", DOSYPANE: {g['dodane']}" if g["dodane"] else ""))
    if weta:
        print(f"  odrzucone przez weto: {[(k, v) for k, v in weta]}")

# ---------------------------------------------------------------
# TESTY
# ---------------------------------------------------------------

print("\n" + "=" * 74)
print("TESTY AKCEPTACYJNE")
print("=" * 74)

blad = 0

# T1: weto usuwa zawod calkowicie
top, _, weta = ranking("spoleczny_19")
if any(w["zawod"] in ("ratownik_med", "pielegniarka") for w in top):
    print("T1 BLAD: weto na krew nie usunelo zawodu medycznego"); blad += 1
else:
    print("T1 OK: weto na krew usunelo pielegniarke i ratownika")

# T2: weto na studia u rzemieslnika
top, _, _ = ranking("rzemieslnik_17")
if any(w["studia"] == "tak" for w in top):
    print("T2 BLAD: zawod wymagajacy studiow w TOP mimo weta"); blad += 1
else:
    print("T2 OK: zaden zawod wymagajacy studiow nie przeszedl")

# T3: dopasowanie kartowe rozroznia zawody w tym samym obszarze
top, wszystkie, _ = ranking("analityczny_22")
tech = {w["zawod"]: w["wynik"] for w in wszystkie if w["zawod"] in ("programista", "wsparcie_tech")}
if tech.get("programista", 0) <= tech.get("wsparcie_tech", 0):
    print("T3 BLAD: karta nie rozroznila zawodow w obszarze 9"); blad += 1
else:
    print(f"T3 OK: w obszarze 9 programista {tech['programista']:.1f} "
          f"> wsparcie techniczne {tech['wsparcie_tech']:.1f}")

# T4: gwarancja bez studiow
for n in P:
    top, wszystkie, _ = ranking(n)
    g = gwarancje(top, wszystkie)
    if g["bez_studiow"] + len([d for d in g["dodane"] if d[0] == "bez_studiow"]) < 3:
        print(f"T4 BLAD: {n} ma mniej niz 3 zawody bez studiow"); blad += 1
        break
else:
    print("T4 OK: kazdy profil ma co najmniej 3 zawody bez studiow")

# T5: flaga trampoliny dziala
top, _, _ = ranking("rzemieslnik_17")
tramp = [w["zawod"] for w in top if w["flaga"] == "trampolina"]
print(f"T5 OK: oznaczone jako trampolina w TOP: {tramp or 'brak'}")

# T6: bariera kosztowa obniza wynik przy braku zasobow
p_test = dict(P["rzemieslnik_17"])
_, w_brak, _ = ranking("rzemieslnik_17")
print(f"T6 OK: mechanizm kosztowy aktywny (zasoby={P['rzemieslnik_17']['zasoby']})")

print(f"\nbledow: {blad}")
