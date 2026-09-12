import { PrismaClient } from "@prisma/client";

/**
 * Adres bazy z dopiskami wymaganymi przez pulę połączeń.
 *
 * Na Vercelu adres wstrzykuje integracja Neona i nie ma go jak tam zmienić.
 * Adres puli (host z `-pooler`) prowadzi do PgBouncera w trybie transakcyjnym,
 * a Prisma domyślnie korzysta z instrukcji przygotowanych, których PgBouncer
 * w tym trybie nie utrzymuje między zapytaniami. Efektem jest błąd
 * „prepared statement already exists”, który pojawia się dopiero przy ruchu,
 * czyli w najgorszym możliwym momencie: gdy dwanaście osób wypełnia moduł.
 *
 * `pgbouncer=true` wyłącza instrukcje przygotowane, `connect_timeout` daje
 * czas na obudzenie bazy, która po pięciu minutach bezczynności usypia.
 *
 * Adres bez puli zostawiamy w spokoju: korzysta z niego tylko `prisma db push`.
 */
function adresBazy(): string | undefined {
  const adres = process.env.DATABASE_URL;
  if (!adres || !adres.includes("-pooler")) return adres;
  const znak = adres.includes("?") ? "&" : "?";
  const brakujace = [
    adres.includes("pgbouncer=") ? null : "pgbouncer=true",
    adres.includes("connect_timeout=") ? null : "connect_timeout=15",
  ].filter(Boolean);
  return brakujace.length > 0 ? `${adres}${znak}${brakujace.join("&")}` : adres;
}

const globalDlaPrismy = globalThis as unknown as { prisma?: PrismaClient };

const adres = adresBazy();

export const prisma =
  globalDlaPrismy.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    ...(adres ? { datasources: { db: { url: adres } } } : {}),
  });

if (process.env.NODE_ENV !== "production") globalDlaPrismy.prisma = prisma;
