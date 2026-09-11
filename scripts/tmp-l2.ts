import { KOMPETENCJE_A2, WARTOSCI_A4, FILTRY_A5, WYMIARY_A3 } from "../lib/domain/slowniki";
import { OBSZARY_M1 } from "../lib/content/m1";
console.log("KOMPETENCJE A2:");
for (const k of KOMPETENCJE_A2) console.log(` ${String(k.id).padStart(2)} ${k.nazwa}`);
console.log("\nWARTOSCI A4:");
for (const w of WARTOSCI_A4) console.log(` ${w.kod.padEnd(6)} ${w.nazwa}`);
console.log("\nBLOKI A5:");
for (const b of [...new Set(FILTRY_A5.map((f) => f.blok))]) {
  console.log(` ${b}  ${FILTRY_A5.find((f) => f.blok === b)!.nazwaBloku}  (${FILTRY_A5.filter((f) => f.blok === b).length})`);
}
console.log("\nWYMIARY A3:");
for (const w of WYMIARY_A3) console.log(` ${w.kod}  ${w.biegunA}  /  ${w.biegunB}`);
console.log("\nOBSZARY M1:");
for (const o of OBSZARY_M1) console.log(` ${o.nr}  ${o.tytul}`);
