# -*- coding: utf-8 -*-
import importlib.util, sys, json
spec = importlib.util.spec_from_file_location("b1","baza_1.py")
b1 = importlib.util.module_from_spec(spec); spec.loader.exec_module(b1)
Z, z = b1.Z, b1.z
for m in ("baza_2","baza_3","baza_4"):
    s = importlib.util.spec_from_file_location(m, m+".py")
    mod = importlib.util.module_from_spec(s); s.loader.exec_module(mod)
    mod.wpisz(z)
print(f"\nRAZEM ZAWODOW: {len(Z)}")
from collections import Counter
print("wg obszarow:", dict(sorted(Counter(v['obszar'] for v in Z.values()).items())))
print("wg poziomu :", dict(Counter(v['poziom'] for v in Z.values())))
print("studia     :", dict(Counter(v['studia'] for v in Z.values())))
print("flagi      :", dict(Counter(v['flaga'] for v in Z.values())))
print("zagrozenie :", dict(Counter(v['zagr'] for v in Z.values())))
json.dump(Z, open("zawody.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("\nzapisano zawody.json")
