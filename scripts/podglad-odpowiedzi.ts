import { prisma } from "../lib/db/klient";
async function main() {
  const wiersze = await prisma.odpowiedz.findMany({
    orderBy: { zaktualizowana: "desc" },
    take: 8,
    include: { uczestnik: { select: { imie: true } } },
  });
  for (const w of wiersze) {
    console.log(
      `${w.uczestnik.imie.padEnd(8)} ${w.modul}/${w.czesc} ${w.pozycja.padEnd(14)} ` +
        `${w.wartosc.slice(0, 60).padEnd(62)} ${String(w.msSpent ?? "").padStart(6)} ms  rew.${w.rewizje}`,
    );
  }
  console.log(`\nrazem odpowiedzi: ${await prisma.odpowiedz.count()}`);
  const p = await prisma.postepModulu.findMany();
  for (const x of p) console.log(`postep: ${x.kod} ostatnia=${x.ostatniaPozycja} plan=${x.kolejnosc ? "utrwalony" : "brak"}`);
  await prisma.$disconnect();
}
void main();
