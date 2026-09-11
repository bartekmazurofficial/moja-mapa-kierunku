import { OBSZARY_A1, KOMPETENCJE_A2, WYMIARY_A3, WARTOSCI_A4, FILTRY_A5, WYMIARY_M1 } from "../lib/domain/slowniki";
import { BLOKI_A1 } from "../lib/content/a1";
import { BLOKI_A2 } from "../lib/content/a2";
import { PARY_A3 } from "../lib/content/a3";
import { PARY_A4 } from "../lib/content/a4";
import { OBSZARY_M1, PARY_M1 } from "../lib/content/m1";

console.log("A1  obszary:", OBSZARY_A1.length, "| bloki:", BLOKI_A1.length, "| pozycji:", BLOKI_A1.reduce((s, b) => s + b.pozycje.length, 0));
console.log("A2  kompetencje:", KOMPETENCJE_A2.length, "| bloki:", BLOKI_A2.length, "| pozycji:", BLOKI_A2.reduce((s, b) => s + b.pozycje.length, 0));
console.log("A3  wymiary:", WYMIARY_A3.length, "| par:", PARY_A3.length);
console.log("A4  wartosci:", WARTOSCI_A4.length, "| par:", PARY_A4.length);
console.log("A5  filtry:", FILTRY_A5.length, "| blokow:", new Set(FILTRY_A5.map((f) => f.blok)).size);
console.log("M1  wymiary:", WYMIARY_M1.length, "| par:", PARY_M1.length, "| obszary:", OBSZARY_M1.length);
console.log("\nA1 obszary:");
for (const o of OBSZARY_A1) console.log(` ${String(o.id).padStart(2)} ${o.etykieta}`);
