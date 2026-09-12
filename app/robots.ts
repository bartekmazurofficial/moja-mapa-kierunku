import type { MetadataRoute } from "next";

/**
 * Nic do indeksowania.
 *
 * Pod adresem `/u/<kod>` leży raport z wizją życia, informacjami o zdrowiu
 * i sytuacji finansowej konkretnej osoby. Kod dostępu jest losowy, więc
 * adresu nie da się zgadnąć, ale wystarczy, że ktoś wklei swój link gdzieś
 * publicznie, żeby wyszukiwarka poszła za nim dalej.
 *
 * To nie jest zabezpieczenie samo w sobie, tylko zdjęcie jednej drogi wycieku,
 * która nic nie kosztuje.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
