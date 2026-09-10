/** Kontrola: czy tabela antyprofilu pokrywa dokladnie 60 kodow ze slownika kart. */
import { ANTYPROFIL, kodyNieaktywne } from "../lib/engine/antyprofil";
import { KODY_ANTY } from "../lib/domain/kody-kart";

const wTabeli = new Set(Object.keys(ANTYPROFIL));
const wSlowniku = new Set<string>(KODY_ANTY);
const brakujace = [...wSlowniku].filter((k) => !wTabeli.has(k)).sort();
const nadmiarowe = [...wTabeli].filter((k) => !wSlowniku.has(k)).sort();
const aktywne = Object.entries(ANTYPROFIL).filter(([, r]) => r.aktywna).length;

console.log(`slownik kart: ${wSlowniku.size}   tabela: ${wTabeli.size}`);
console.log(`aktywne: ${aktywne}   nieaktywne: ${kodyNieaktywne().length}`);
if (brakujace.length) console.log("BRAKUJE W TABELI:", brakujace);
if (nadmiarowe.length) console.log("NADMIAROWE W TABELI:", nadmiarowe);
if (!brakujace.length && !nadmiarowe.length) console.log("pokrycie pelne");
