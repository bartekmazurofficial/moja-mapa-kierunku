/**
 * Dane dla testów opartych o bazę.
 *
 * Testy nie mogą zależeć od tego, co ktoś ręcznie wpisał w aplikacji: reset
 * postępów uczestników wywracał dwanaście testów naraz. Fikstura zakłada
 * własną grupę, oddzieloną od grup pilotażowych, i wypełnia ją sama.
 * Jest idempotentna — drugi przebieg tylko odczytuje to, co już jest.
 */

import { prisma } from "@/lib/db/klient";
import { wypelnijUczestnika, type ProfilTestowy } from "@/lib/testy/wypelnianie";
import { otworzModul } from "@/lib/moduly/otwarcie";
import { KOLEJNOSC_MODULOW } from "@/lib/moduly/ekrany";

const KOD_GRUPY = "TESTAUTO";
const NAZWA = "Grupa testowa (automat)";

/** Profil -> kod dostępu w grupie testowej. Stały, żeby dało się go debugować. */
const UCZESTNICY: Record<ProfilTestowy, { kod: string; imie: string }> = {
  rzemieslniczy: { kod: "TEST000001", imie: "Test rzemieślniczy" },
  spoleczny: { kod: "TEST000002", imie: "Test społeczny" },
  analityczny: { kod: "TEST000003", imie: "Test analityczny" },
  plaski: { kod: "TEST000004", imie: "Test płaski" },
};

async function grupaTestowa() {
  const istniejaca = await prisma.grupa.findUnique({ where: { kod: KOD_GRUPY } });
  if (istniejaca) return istniejaca;
  return prisma.grupa.create({ data: { kod: KOD_GRUPY, nazwa: NAZWA } });
}

/**
 * Zwraca uczestnika o danym profilu, z wypełnionymi siedmioma modułami
 * i wszystkimi modułami otwartymi. Tworzy go, jeśli jeszcze nie istnieje.
 */
export async function uczestnikTestowy(profil: ProfilTestowy = "rzemieslniczy") {
  const grupa = await grupaTestowa();
  for (const m of KOLEJNOSC_MODULOW) await otworzModul(grupa.id, m);

  const { kod, imie } = UCZESTNICY[profil];
  let uczestnik = await prisma.uczestnik.findUnique({ where: { kodDostepu: kod } });
  if (!uczestnik) {
    uczestnik = await prisma.uczestnik.create({
      data: { grupaId: grupa.id, imie, kodDostepu: kod },
    });
  }

  const ile = await prisma.odpowiedz.count({ where: { uczestnikId: uczestnik.id } });
  if (ile < 300) await wypelnijUczestnika(uczestnik.id, profil);

  return uczestnik;
}

/** Grupa testowa z kompletem czterech profili. Do testów, które liczą medianę. */
export async function grupaZKompletem() {
  const grupa = await grupaTestowa();
  for (const profil of Object.keys(UCZESTNICY) as ProfilTestowy[]) {
    await uczestnikTestowy(profil);
  }
  // Piąty i szósty uczestnik: reguła tempa wymaga pięciu ukończeń.
  for (const [i, profil] of (["spoleczny", "analityczny"] as ProfilTestowy[]).entries()) {
    const kod = `TEST00001${i}`;
    let u = await prisma.uczestnik.findUnique({ where: { kodDostepu: kod } });
    if (!u) {
      u = await prisma.uczestnik.create({
        data: { grupaId: grupa.id, imie: `Test dodatkowy ${i + 1}`, kodDostepu: kod },
      });
    }
    const ile = await prisma.odpowiedz.count({ where: { uczestnikId: u.id } });
    if (ile < 300) await wypelnijUczestnika(u.id, profil);
  }
  return grupa;
}
