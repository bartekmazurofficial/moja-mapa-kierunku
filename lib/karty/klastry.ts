import "server-only";
import { prisma } from "@/lib/db/klient";

/**
 * Klastry: grupy zawodow, ktorych odpowiedzi uczestnika nie rozroznaja.
 *
 * Raport mowi przy takiej grupie wprost: „Twoje odpowiedzi nie rozstrzygaja.
 * Przeczytaj obie karty" - i na tym konczyl. Te funkcje dowiaduja sie, z kim
 * dany zawod stoi w klastrze, zeby dalo sie wejsc w porownanie z karty i z
 * listy zawodow, niezaleznie od tego, czy oba zawody przekroczyly prog.
 */

export interface TowarzyszKlastra {
  kod: string;
  nazwa: string;
}

/** Pozostale zawody z tego samego klastra. Pusta lista, gdy zawod stoi sam. */
export async function towarzyszeZKlastra(
  kodZawodu: string,
  klasterKod: string | null,
): Promise<TowarzyszKlastra[]> {
  if (!klasterKod) return [];
  const zawody = await prisma.zawod.findMany({
    where: { klasterKod, kod: { not: kodZawodu } },
    select: { kod: true, nazwaWyswietlana: true },
  });
  return zawody.map((z) => ({ kod: z.kod, nazwa: z.nazwaWyswietlana }));
}

export interface OpisKlastra {
  kod: string;
  nazwa: string;
  pytanie: string;
  roznica: string;
  uwaga: string | null;
}

/** Klaster wspolny dla dwoch zawodow albo nic, gdy nie stoja w tym samym. */
export async function klasterPary(
  kodA: string,
  kodB: string,
): Promise<OpisKlastra | null> {
  const zawody = await prisma.zawod.findMany({
    where: { kod: { in: [kodA, kodB] } },
    select: { kod: true, klasterKod: true },
  });
  if (zawody.length !== 2) return null;
  const [a, b] = zawody;
  if (!a.klasterKod || a.klasterKod !== b.klasterKod) return null;
  const klaster = await prisma.klaster.findUnique({ where: { kod: a.klasterKod } });
  if (!klaster) return null;
  return {
    kod: klaster.kod,
    nazwa: klaster.nazwa,
    pytanie: klaster.pytanie,
    roznica: klaster.roznica,
    uwaga: klaster.uwaga,
  };
}
