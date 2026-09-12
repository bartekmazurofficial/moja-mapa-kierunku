/** @type {import('next').NextConfig} */
const nextConfig = {
  // typedRoutes wylaczone: adresy uczestnika sa budowane z kodu dostepu,
  // wiec i tak sa dynamiczne, a typowanie tras dokladalo tylko rzutowan.

  /**
   * Eksport PDF czyta fonty z dysku przy pierwszym zadaniu. Na serwerze
   * bezserwerowym do paczki funkcji trafia tylko to, co sledzenie zaleznosci
   * samo znajdzie w importach — a `join(process.cwd(), ...)` znalezc sie nie da.
   * Bez tego wpisu raport w PDF wywala sie na produkcji, a lokalnie dziala.
   */
  outputFileTracingIncludes: {
    "/u/[kod]/raport/pdf": ["./data/generated/fonty/**"],
  },
};

export default nextConfig;
