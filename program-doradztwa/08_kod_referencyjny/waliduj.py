# -*- coding: utf-8 -*-
import json, itertools, random
from collections import Counter, defaultdict
random.seed(11)
Z = json.load(open("zawody.json",encoding="utf-8"))
import importlib.util
s = importlib.util.spec_from_file_location("b1","baza_1.py")
b1 = importlib.util.module_from_spec(s); s.loader.exec_module(b1)

print("="*72); print("WALIDACJA BAZY 157 ZAWODOW"); print("="*72)
bledy = []

# --- 1. slowniki kontrolowane ---
print("\n1. ZGODNOSC ZE SLOWNIKAMI")
poza = defaultdict(set)
for k,v in Z.items():
    for pole, slownik in (("a1",b1.A1_KODY),("a2r",b1.A2_KODY),("a2w",b1.A2_KODY),
                          ("a3",b1.A3_KODY),("a4p",b1.A4_KODY),("a4m",b1.A4_KODY),
                          ("a5",b1.A5_KODY),("m1",b1.M1_KODY),("anty",b1.ANTY_KODY),
                          ("przedm",b1.PRZEDM),("przeciw",b1.PRZECIW),("dosw",b1.DOSW)):
        for kod in v[pole]:
            if kod not in slownik: poza[pole].add(kod)
for pole,kody in poza.items():
    print(f"   {pole}: kody spoza slownika -> {sorted(kody)}")
if not poza: print("   OK, wszystkie kody w slownikach")

# --- 2. kompletnosc ---
print("\n2. KOMPLETNOSC POL")
braki = [k for k,v in Z.items() if not v["a1"] or not v["a2r"] or not v["a5"] or not v["anty"]]
print(f"   zawodow z brakami w polach obowiazkowych: {len(braki)} {braki[:5]}")
if braki: bledy.append("braki")

# --- 3. rozroznialnosc ---
print("\n3. ROZROZNIALNOSC")
sig = defaultdict(list)
for k,v in Z.items(): sig[(v["obszar"], tuple(sorted(v["a1"])), tuple(sorted(v["a2r"])))].append(k)
klony = {s:v for s,v in sig.items() if len(v)>1}
print(f"   grup o identycznej sygnaturze: {len(klony)}")
for s,v in klony.items(): print(f"      {v}  (klaster: {[Z[x]['klaster'] for x in v]})")
nieoznaczone = [v for s,v in klony.items() if not all(Z[x]['klaster'] for x in v)]
if nieoznaczone:
    print(f"   BLAD: klony bez oznaczenia klastra: {nieoznaczone}"); bledy.append("klony bez klastra")

# --- 4. osiagalnosc ---
print("\n4. OSIAGALNOSC")
A1 = sorted({x for v in Z.values() for x in v["a1"]})
A2 = sorted({x for v in Z.values() for x in v["a2r"]})
def wyn(p1,p2,v):
    return 0.6*len(p1 & set(v["a1"]))/len(v["a1"]) + 0.4*len(p2 & set(v["a2r"]))/len(v["a2r"])
N=8000; licz=Counter(); top3=set()
for _ in range(N):
    p1=set(random.sample(A1,5)); p2=set(random.sample(A2,6))
    r=sorted(Z.items(), key=lambda kv:-wyn(p1,p2,kv[1]))
    for k,_ in r[:10]: licz[k]+=1
    top3.add(tuple(k for k,_ in r[:3]))
zero=[k for k in Z if licz[k]==0]
print(f"   osiagalnych w TOP10: {len(Z)-len(zero)}/{len(Z)}")
print(f"   nieosiagalnych: {len(zero)} {zero}")
if zero: bledy.append("sieroty")
print(f"   najczestszy: {licz.most_common(1)[0][0]} ({100*licz.most_common(1)[0][1]/N:.1f}%)")
print(f"   roznorodnosc TOP3: {len(top3)/N:.3f}")
if licz.most_common(1)[0][1]/N > 0.15: bledy.append("dominacja")

# --- 5. wygrywanie wlasnego profilu ---
print("\n5. WYGRYWANIE WLASNEGO PROFILU IDEALNEGO")
nie_wyg=[]
for k,v in Z.items():
    r=sorted(Z.items(), key=lambda kv:-wyn(set(v["a1"]),set(v["a2r"]),kv[1]))
    if r[0][0]!=k and not (Z[k]["klaster"] and Z[k]["klaster"]==Z[r[0][0]]["klaster"]):
        nie_wyg.append((k,r[0][0]))
print(f"   nie wygrywaja i nie sa w klastrze ze zwyciezca: {len(nie_wyg)}")
for k,w in nie_wyg: print(f"      {k:<24} przegrywa z {w}")

# --- 6. gwarancje ---
print("\n6. GWARANCJE STRUKTURALNE")
print(f"   zawodow bez studiow: {sum(1 for v in Z.values() if v['studia']=='nie')}")
print(f"   szybkie wejscie:     {sum(1 for v in Z.values() if v['poziom']=='szybki')}")
print(f"   obszary pokryte:     {len({v['obszar'] for v in Z.values()})}/27")
print(f"   zawodow z kierunkiem: {sum(1 for v in Z.values() if v['kier'])}")
print(f"   klastry:             {len({v['klaster'] for v in Z.values() if v['klaster']})}")

print("\n" + "="*72)
print("BLEDY DO NAPRAWY:", bledy if bledy else "brak")
