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
    "/u/[kod]/raport/pdf": [
      "./data/generated/fonty/**",
      // pdfkit wczytuje wbudowane metryki fontow (Helvetica i reszta czternastki
      // bazowej) przez `require` liczony w czasie dzialania, wiec sledzenie
      // zaleznosci ich nie widzi. Bez tego eksport PDF wywala sie na produkcji
      // z MODULE_NOT_FOUND, a lokalnie dziala, bo caly node_modules jest na dysku.
      "./node_modules/pdfkit/js/**",
      "./node_modules/fontkit/**",
    ],
  },

  /**
   * Renderer PDF zostaje poza paczka aplikacji i jest wymagany z node_modules.
   * Pakowanie go razem z kodem gubi dynamiczne `require` w pdfkit.
   */
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
