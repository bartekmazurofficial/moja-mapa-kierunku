# -*- coding: utf-8 -*-
"""
AUDYT OSIAGALNOSCI
Pytanie: czy kazdy ze 152 zawodow moze w ogole wyjsc z danych assesmentowych?
Metoda: symulacja profili uczestnikow, pomiar pokrycia i rozroznialnosci.
"""
import itertools, random
random.seed(7)

# ============================================================
# 152 ZAWODY: (kod, obszar, A1 wysoko, A2 rdzen)
# ============================================================
R = []
def z(k, o, a1, a2): R.append((k, o, frozenset(a1.split()), frozenset(a2.split())))

# 1 biznes
z("project_manager",1,"planowanie prowadzenie porzadek","organizowanie wielozadaniowosc prowadzenie_grupy")
z("product_manager",1,"prowadzenie liczby tech","analiza system przekonywanie")
z("analityk_biznesowy",1,"porzadek liczby uczenie","analiza system wyjasnianie")
z("konsultant",1,"liczby prowadzenie przekonywanie","analiza system wystapienia")
z("kierownik_zespolu",1,"prowadzenie planowanie rozmowa","prowadzenie_grupy organizowanie rozbrajanie")
# 2 marketing
z("spec_marketingu",2,"przekonywanie pisanie obraz","przekonywanie slowo tworzenie")
z("copywriter",2,"pisanie przekonywanie obraz","slowo przekonywanie tworzenie")
z("social_media",2,"obraz pisanie scena","tworzenie estetyka slowo")
z("seo",2,"liczby tech porzadek","analiza system dokladnosc")
z("pr",2,"pisanie przekonywanie prawo","slowo przekonywanie opanowanie")
z("brand_manager",2,"przekonywanie obraz prowadzenie","estetyka analiza system")
# 3 sprzedaz
z("handlowiec",3,"przekonywanie prawo przedsiebiorczosc","przekonywanie negocjowanie odpornosc")
z("account_manager",3,"przekonywanie rozmowa planowanie","negocjowanie wyczuwanie uprzejmosc")
z("doradca_bank",3,"pieniadze przekonywanie rozmowa","przekonywanie uprzejmosc rachunki")
z("agent_nieruchomosci",3,"przekonywanie prawo przedsiebiorczosc","przekonywanie negocjowanie odpornosc")
z("business_dev",3,"przekonywanie prawo prowadzenie","negocjowanie przekonywanie analiza")
# 4 finanse
z("ksiegowy",4,"pieniadze liczby precyzja porzadek","rachunki dokladnosc reguly")
z("glowny_ksiegowy",4,"pieniadze precyzja porzadek prowadzenie","reguly dokladnosc rachunki")
z("analityk_finansowy",4,"liczby pieniadze dociekanie","rachunki analiza system")
z("kontroler_finansowy",4,"liczby pieniadze porzadek","analiza system rachunki")
z("doradca_podatkowy",4,"prawo pieniadze precyzja liczby","reguly analiza slowo")
z("spec_plac",4,"pieniadze precyzja porzadek","dokladnosc reguly rachunki")
# 5 administracja
z("spec_admin",5,"porzadek precyzja planowanie","organizowanie dokladnosc wielozadaniowosc")
z("office_manager",5,"planowanie porzadek rozmowa","organizowanie wielozadaniowosc uprzejmosc")
z("spec_hr",5,"rozmowa porzadek prowadzenie","wyczuwanie reguly rozbrajanie")
z("rekruter",5,"rozmowa przekonywanie uczenie","wyczuwanie przekonywanie odpornosc")
z("urzednik",5,"porzadek prawo precyzja","reguly dokladnosc uprzejmosc")
z("obsluga_klienta",5,"rozmowa uczenie porzadek","uprzejmosc wyjasnianie cierpliwosc")
# 6 dane
z("analityk_danych",6,"liczby tech dociekanie","analiza rachunki system")
z("spec_bi",6,"liczby tech porzadek","system analiza dokladnosc")
z("data_scientist",6,"liczby tech dociekanie","analiza rachunki system")
z("analityk_rynku",6,"dociekanie liczby rozmowa","analiza wyczuwanie rachunki")
# 7 prawo
z("radca_prawny",7,"prawo pisanie dociekanie","reguly analiza slowo")
z("prawnik_wewnetrzny",7,"prawo porzadek pisanie","reguly analiza slowo")
z("spec_zgodnosci",7,"prawo porzadek precyzja","reguly dokladnosc analiza")
z("notariusz",7,"prawo precyzja porzadek","reguly dokladnosc uprzejmosc")
z("kurator_sadowy",7,"prawo opieka rozmowa","wyczuwanie reguly rozbrajanie")
# 8 sluzby
z("policjant",8,"prawo ruch wspolnota","opanowanie wytrzymalosc rozbrajanie")
z("strazak",8,"ruch wspolnota naprawianie","opanowanie wytrzymalosc sprzet")
z("zolnierz",8,"ruch wspolnota prawo","wytrzymalosc opanowanie reguly")
z("funkcjonariusz_sw",8,"prawo wspolnota rozmowa","opanowanie rozbrajanie reguly")
z("spec_bhp",8,"prawo precyzja porzadek","reguly dokladnosc wyjasnianie")
z("ratownik_gorski",8,"ruch przyroda wspolnota","wytrzymalosc opanowanie sprzet")
# 9 technologia
z("programista",9,"tech liczby dociekanie","problemy uczenie_sie system")
z("tester",9,"precyzja tech porzadek","dokladnosc analiza reguly")
z("administrator",9,"tech naprawianie porzadek","system problemy sprzet")
z("wsparcie_tech",9,"tech uczenie naprawianie","wyjasnianie uprzejmosc problemy")
z("devops",9,"tech porzadek naprawianie","system problemy uczenie_sie")
z("cyberbezpieczenstwo",9,"tech dociekanie prawo","problemy system analiza")
z("spec_wdrozen",9,"tech uczenie rozmowa","wyjasnianie problemy organizowanie")
z("inzynier_danych",9,"tech liczby porzadek","system analiza problemy")
# 10 inzynieria
z("inzynier_mechanik",10,"naprawianie rece tech precyzja","problemy przestrzenna system")
z("automatyk",10,"tech naprawianie precyzja","problemy sprzet system")
z("technolog_produkcji",10,"precyzja planowanie tech","system organizowanie analiza")
z("inzynier_jakosci",10,"precyzja tech porzadek","dokladnosc analiza reguly")
z("operator_cnc",10,"rece precyzja naprawianie","manualne dokladnosc sprzet")
z("kierownik_ruchu",10,"naprawianie prowadzenie planowanie","problemy prowadzenie_grupy opanowanie")
# 11 nauka
z("pracownik_naukowy",11,"dociekanie liczby precyzja","system analiza cierpliwosc")
z("spec_rd",11,"dociekanie liczby precyzja tech","analiza system tworzenie")
z("technik_lab",11,"precyzja dociekanie","dokladnosc reguly cierpliwosc")
z("diagnosta_lab",11,"zdrowie precyzja dociekanie","dokladnosc analiza reguly")
# 12 budownictwo
z("architekt",12,"obraz precyzja naprawianie planowanie","przestrzenna estetyka dokladnosc")
z("inzynier_budownictwa",12,"naprawianie precyzja tech liczby","rachunki przestrzenna dokladnosc")
z("kierownik_budowy",12,"naprawianie prowadzenie planowanie ruch","organizowanie prowadzenie_grupy opanowanie")
z("kosztorysant",12,"liczby precyzja naprawianie pieniadze","rachunki dokladnosc przestrzenna")
z("geodeta",12,"precyzja liczby ruch tech","dokladnosc rachunki sprzet")
z("projektant_instalacji",12,"naprawianie tech precyzja liczby","rachunki system przestrzenna")
# 13 rzemioslo
z("elektryk",13,"naprawianie rece precyzja tech","manualne sprzet problemy")
z("hydraulik",13,"naprawianie rece precyzja","manualne problemy sprzet")
z("stolarz",13,"rece precyzja obraz","manualne dokladnosc przestrzenna")
z("mechanik",13,"naprawianie rece tech","problemy manualne sprzet")
z("spawacz",13,"rece precyzja naprawianie","manualne dokladnosc wytrzymalosc")
z("fryzjer",13,"obraz rece rozmowa","manualne estetyka uprzejmosc")
z("kosmetolog",13,"obraz zdrowie rozmowa","manualne dokladnosc uprzejmosc")
z("krawiec",13,"rece precyzja obraz","manualne dokladnosc przestrzenna")
z("technik_serwisu",13,"naprawianie tech rece","problemy sprzet manualne")
z("instalator_pv",13,"rece ruch tech","manualne wytrzymalosc sprzet")
# 14 transport
z("spedytor",14,"planowanie przekonywanie porzadek","organizowanie wielozadaniowosc opanowanie")
z("spec_logistyki",14,"planowanie liczby porzadek","organizowanie analiza system")
z("kierownik_magazynu",14,"planowanie prowadzenie porzadek","organizowanie prowadzenie_grupy dokladnosc")
z("kierowca",14,"ruch naprawianie planowanie","sprzet samodzielnosc wytrzymalosc")
z("dyspozytor",14,"planowanie prowadzenie porzadek","organizowanie wielozadaniowosc opanowanie")
# 15 rolnictwo
z("weterynarz",15,"przyroda zdrowie dociekanie","opiekunczosc dokladnosc opanowanie")
z("technik_wet",15,"przyroda opieka zdrowie","opiekunczosc manualne dokladnosc")
z("agronom",15,"przyroda ruch dociekanie","analiza dokladnosc wyjasnianie")
z("lesnik",15,"przyroda ruch porzadek","samodzielnosc dokladnosc analiza")
z("ogrodnik",15,"przyroda rece ruch","wytrzymalosc manualne sprzet")
z("spec_srodowiska",15,"przyroda porzadek precyzja prawo","reguly dokladnosc analiza")
# 16 medycyna
z("lekarz",16,"zdrowie dociekanie opieka","zapamietywanie opanowanie dokladnosc")
z("pielegniarka",16,"zdrowie opieka rozmowa","opiekunczosc opanowanie dokladnosc")
z("ratownik_med",16,"zdrowie ruch opieka","opanowanie dokladnosc wytrzymalosc")
z("polozna",16,"zdrowie opieka rozmowa","opanowanie opiekunczosc dokladnosc")
z("farmaceuta",16,"zdrowie precyzja dociekanie","zapamietywanie dokladnosc reguly")
z("technik_farm",16,"zdrowie precyzja rozmowa","dokladnosc uprzejmosc zapamietywanie")
z("technik_radiolog",16,"zdrowie tech precyzja","dokladnosc sprzet reguly")
z("opiekun_med",16,"opieka zdrowie rozmowa","opiekunczosc wytrzymalosc uprzejmosc")
# 17 rehabilitacja
z("fizjoterapeuta",17,"zdrowie opieka ruch","opiekunczosc wyjasnianie manualne")
z("masazysta",17,"zdrowie opieka ruch","manualne opiekunczosc wytrzymalosc")
z("dietetyk",17,"zdrowie rozmowa uczenie","wyjasnianie wyczuwanie analiza")
z("terapeuta_zajeciowy",17,"opieka uczenie rece","opiekunczosc wyjasnianie wyczuwanie")
z("optyk",17,"precyzja rece zdrowie","manualne dokladnosc uprzejmosc")
z("protetyk_sluchu",17,"zdrowie precyzja rozmowa","dokladnosc cierpliwosc wyjasnianie")
# 18 sport
z("trener_personalny",18,"ruch uczenie zdrowie","wyjasnianie wytrzymalosc przekonywanie")
z("trener_druzyny",18,"ruch prowadzenie uczenie","prowadzenie_grupy wyjasnianie opanowanie")
z("nauczyciel_wf",18,"ruch uczenie rozmowa","wyjasnianie prowadzenie_grupy cierpliwosc")
z("instruktor_rekreacji",18,"ruch uczenie wspolnota","wyjasnianie wytrzymalosc opanowanie")
# 19 opieka
z("pracownik_socjalny",19,"opieka rozmowa wspolnota","wyczuwanie opiekunczosc reguly")
z("asystent_rodziny",19,"opieka rozmowa uczenie","opiekunczosc wyczuwanie wyjasnianie")
z("opiekun_starszej",19,"opieka rozmowa zdrowie","opiekunczosc wytrzymalosc uprzejmosc")
z("asystent_niepelno",19,"opieka rozmowa wspolnota","opiekunczosc wyczuwanie wytrzymalosc")
z("opiekunka_dziecieca",19,"opieka uczenie wspolnota","opiekunczosc wyczuwanie uprzejmosc")
z("kierownik_placowki",19,"prowadzenie opieka porzadek","prowadzenie_grupy organizowanie reguly")
# 20 psychologia
z("psycholog",20,"rozmowa opieka dociekanie","wyczuwanie rozbrajanie analiza")
z("psychoterapeuta",20,"rozmowa dociekanie opieka","wyczuwanie cierpliwosc rozbrajanie")
z("doradca_zawodowy",20,"rozmowa uczenie wspolnota","wyczuwanie wyjasnianie analiza")
z("interwent",20,"rozmowa opieka wspolnota","opanowanie wyczuwanie rozbrajanie")
z("coach",20,"rozmowa przekonywanie uczenie","wyczuwanie wyjasnianie odpornosc")
# 21 edukacja
z("nauczyciel",21,"uczenie rozmowa","wyjasnianie wystapienia cierpliwosc")
z("nauczyciel_przedszkola",21,"uczenie opieka wspolnota","opiekunczosc wyjasnianie prowadzenie_grupy")
z("pedagog_specjalny",21,"uczenie opieka rozmowa","opiekunczosc wyjasnianie tworzenie")
z("trener_biznesu",21,"uczenie przekonywanie rozmowa","wyjasnianie wystapienia prowadzenie_grupy")
z("lektor",21,"uczenie pisanie rozmowa","wyjasnianie cierpliwosc slowo")
# 22 wspolnota
z("koordynator_ngo",22,"wspolnota planowanie rozmowa","organizowanie prowadzenie_grupy slowo")
z("fundraiser",22,"przekonywanie wspolnota pisanie","przekonywanie slowo odpornosc")
z("animator",22,"wspolnota rozmowa uczenie","wyczuwanie prowadzenie_grupy organizowanie")
z("duszpasterz",22,"wspolnota rozmowa uczenie","wyczuwanie wystapienia opiekunczosc")
z("katecheta",22,"uczenie wspolnota rozmowa","wyjasnianie wystapienia cierpliwosc")
z("misjonarz",22,"wspolnota opieka ruch","samodzielnosc wytrzymalosc problemy")
# 23 projektowanie
z("grafik",23,"obraz precyzja pisanie","estetyka dokladnosc tworzenie")
z("projektant_ux",23,"obraz rozmowa dociekanie","estetyka tworzenie wyczuwanie")
z("ilustrator",23,"obraz rece","estetyka manualne tworzenie")
z("projektant_wnetrz",23,"obraz precyzja planowanie","estetyka przestrzenna organizowanie")
z("fotograf",23,"obraz scena rozmowa","estetyka sprzet opanowanie")
z("projektant_produktu",23,"obraz rece tech naprawianie","przestrzenna estetyka tworzenie")
# 24 media
z("montazysta",24,"obraz scena pisanie","estetyka dokladnosc cierpliwosc")
z("operator_kamery",24,"obraz scena ruch","estetyka sprzet wytrzymalosc")
z("dziennikarz",24,"pisanie dociekanie prawo","slowo analiza odpornosc")
z("tworca_internetowy",24,"scena pisanie obraz","wystapienia tworzenie samodzielnosc")
z("producent",24,"planowanie prowadzenie scena","organizowanie wielozadaniowosc opanowanie")
z("redaktor",24,"pisanie precyzja porzadek","slowo dokladnosc analiza")
# 25 muzyka
z("muzyk",25,"scena precyzja rece","estetyka manualne cierpliwosc")
z("nauczyciel_muzyki",25,"uczenie scena precyzja","wyjasnianie cierpliwosc manualne")
z("realizator_dzwieku",25,"tech scena precyzja","sprzet problemy opanowanie")
z("aktor",25,"scena rozmowa obraz","wystapienia odpornosc zapamietywanie")
z("instruktor_teatralny",25,"scena uczenie wspolnota","prowadzenie_grupy wyjasnianie wyczuwanie")
# 26 gastronomia
z("kucharz",26,"rece planowanie precyzja","opanowanie wielozadaniowosc manualne")
z("cukiernik",26,"rece precyzja obraz","dokladnosc manualne cierpliwosc")
z("szef_kuchni",26,"prowadzenie rece planowanie","prowadzenie_grupy organizowanie opanowanie")
z("barista",26,"rece rozmowa precyzja","uprzejmosc manualne wielozadaniowosc")
z("kelner",26,"rozmowa przekonywanie ruch","uprzejmosc wielozadaniowosc zapamietywanie")
z("recepcjonista",26,"rozmowa porzadek planowanie","uprzejmosc organizowanie wielozadaniowosc")
z("menedzer_restauracji",26,"prowadzenie planowanie przekonywanie","prowadzenie_grupy organizowanie opanowanie")
# 27 przedsiebiorczosc
z("wlasciciel_uslugowej",27,"przedsiebiorczosc przekonywanie prowadzenie","odpornosc przekonywanie samodzielnosc")
z("wlasciciel_warsztatu",27,"przedsiebiorczosc naprawianie rece","manualne samodzielnosc odpornosc")
z("wlasciciel_lokalu",27,"przedsiebiorczosc rece prowadzenie","opanowanie wielozadaniowosc prowadzenie_grupy")
z("zalozyciel_tech",27,"przedsiebiorczosc tech przekonywanie","odpornosc samodzielnosc przekonywanie")
z("franczyzobiorca",27,"przedsiebiorczosc prowadzenie planowanie","organizowanie prowadzenie_grupy reguly")

print(f"Zawodow w audycie: {len(R)}")
A1_ALL = sorted({x for _,_,a1,_ in R for x in a1})
A2_ALL = sorted({x for _,_,_,a2 in R for x in a2})
print(f"Uzytych kodow A1: {len(A1_ALL)}   A2: {len(A2_ALL)}")

# ============================================================
# 1. ROZROZNIALNOSC: czy istnieja zawody o identycznej sygnaturze
# ============================================================
print("\n" + "="*70)
print("1. ROZROZNIALNOSC")
print("="*70)
sig = {}
for k,o,a1,a2 in R:
    sig.setdefault((o,a1,a2), []).append(k)
klony = {s:v for s,v in sig.items() if len(v)>1}
print(f"Grup o identycznej sygnaturze (obszar+A1+A2): {len(klony)}")
for s,v in klony.items():
    print(f"   NIEROZROZNIALNE: {v}")

# blisko-klony: ta sama para w obszarze, roznica <=1 elementu lacznie
print("\nPary prawie nierozroznialne (ten sam obszar, roznica <=1 kodu):")
bliskie=[]
for (k1,o1,a11,a21),(k2,o2,a12,a22) in itertools.combinations(R,2):
    if o1!=o2: continue
    d = len(a11^a12)+len(a21^a22)
    if d<=2: bliskie.append((k1,k2,d))
for k1,k2,d in bliskie: print(f"   {k1:<24} ~ {k2:<24} roznica {d}")
print(f"Razem par prawie nierozroznialnych: {len(bliskie)}")

# ============================================================
# 2. OSIAGALNOSC: czy kazdy zawod moze trafic do TOP
# ============================================================
print("\n" + "="*70)
print("2. OSIAGALNOSC PRZY SYMULACJI PROFILI")
print("="*70)

def wynik(prof_a1, prof_a2, zaw):
    _,o,a1,a2 = zaw
    p1 = len(prof_a1 & a1)/len(a1)
    p2 = len(prof_a2 & a2)/len(a2)
    return 0.6*p1 + 0.4*p2

# A. profile losowe (uczestnik wskazuje 5 obszarow A1 i 6 kompetencji A2)
osiagalne_los = set()
N=6000
for _ in range(N):
    pa1 = set(random.sample(A1_ALL, 5))
    pa2 = set(random.sample(A2_ALL, 6))
    sc = sorted(R, key=lambda zz: -wynik(pa1,pa2,zz))[:10]
    osiagalne_los.update(k for k,_,_,_ in sc)

# B. profile "idealne": dla kazdego zawodu profil = jego wlasna sygnatura
osiagalne_ideal = set()
for k,o,a1,a2 in R:
    pa1, pa2 = set(a1), set(a2)
    sc = sorted(R, key=lambda zz: -wynik(pa1,pa2,zz))[:10]
    osiagalne_ideal.update(x for x,_,_,_ in sc)

sieroty_los = [k for k,_,_,_ in R if k not in osiagalne_los]
sieroty_ideal = [k for k,_,_,_ in R if k not in osiagalne_ideal]

print(f"A. Profile losowe (n={N}), TOP10:")
print(f"   osiagalnych: {len(osiagalne_los)}/{len(R)}  ({100*len(osiagalne_los)/len(R):.0f}%)")
print(f"   NIGDY nie wyszly: {len(sieroty_los)}")
if sieroty_los: print(f"   {sieroty_los}")

print(f"\nB. Profile idealne (profil = sygnatura zawodu), TOP10:")
print(f"   osiagalnych: {len(osiagalne_ideal)}/{len(R)}")
print(f"   NIGDY nie wyszly nawet przy wlasnym profilu idealnym: {len(sieroty_ideal)}")
if sieroty_ideal: print(f"   {sieroty_ideal}")

# C. czy zawod wygrywa wlasny profil idealny
print("\nC. Czy zawod jest nr 1 przy swoim profilu idealnym:")
nie_wygrywa=[]
for k,o,a1,a2 in R:
    sc = sorted(R, key=lambda zz: -wynik(set(a1),set(a2),zz))
    if sc[0][0]!=k:
        nie_wygrywa.append((k, sc[0][0], round(wynik(set(a1),set(a2),sc[0]),3)))
print(f"   Zawodow, ktore NIE wygrywaja wlasnego profilu: {len(nie_wygrywa)}/{len(R)}")
for k,zwyc,w in nie_wygrywa[:15]:
    print(f"      {k:<24} przegrywa z {zwyc}")

# ============================================================
# 3. CZESTOTLIWOSC: czy niektore zawody dominuja
# ============================================================
print("\n" + "="*70)
print("3. DOMINACJA I MARTWE POLA")
print("="*70)
from collections import Counter
licz = Counter()
for _ in range(N):
    pa1 = set(random.sample(A1_ALL, 5)); pa2 = set(random.sample(A2_ALL, 6))
    for k,_,_,_ in sorted(R, key=lambda zz: -wynik(pa1,pa2,zz))[:10]:
        licz[k]+=1
naj = licz.most_common(10)
print("Najczesciej wychodzace (na 6000 profili):")
for k,c in naj: print(f"   {k:<26} {c:>5}  ({100*c/N:.1f}%)")
print("Najrzadziej wychodzace:")
for k,c in licz.most_common()[-10:]: print(f"   {k:<26} {c:>5}  ({100*c/N:.1f}%)")
zero = [k for k,_,_,_ in R if licz[k]==0]
print(f"Zawodow z zerowa czestoscia: {len(zero)} {zero if zero else ''}")

# ============================================================
# 4. ROZDZIELCZOSC: ile realnie roznych wynikow system produkuje
# ============================================================
print("\n" + "="*70)
print("4. ROZDZIELCZOSC SYSTEMU")
print("="*70)
wyniki_top3=set()
for _ in range(N):
    pa1 = set(random.sample(A1_ALL, 5)); pa2 = set(random.sample(A2_ALL, 6))
    t3 = tuple(k for k,_,_,_ in sorted(R, key=lambda zz: -wynik(pa1,pa2,zz))[:3])
    wyniki_top3.add(t3)
print(f"Roznych trojek TOP3 na {N} profili: {len(wyniki_top3)}")
print(f"Wspolczynnik roznorodnosci: {len(wyniki_top3)/N:.3f}")
