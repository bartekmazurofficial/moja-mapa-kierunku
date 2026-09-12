import Link from "next/link";
import { Znak } from "./Znak";

/**
 * Znak programu z nazwą i hasłem. Jedno miejsce, żeby nagłówek modułu, panel
 * boczny i strona wejścia mówiły tym samym głosem.
 */
export function Marka({ href, rozmiar = 40 }: { href?: string; rozmiar?: number }) {
  const tresc = (
    <>
      <Znak rozmiar={rozmiar} />
      <span className="min-w-0">
        <span className="block truncate text-tresc-duza font-extrabold leading-tight tracking-tight text-atrament">
          DreamWork
        </span>
        <span className="block text-drobne uppercase tracking-[0.16em] text-atrament-slaby">
          więcej niż zawód
        </span>
      </span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="przejscie flex items-center gap-3 rounded-xl hover:opacity-85">
        {tresc}
      </Link>
    );
  }
  return <span className="flex items-center gap-3">{tresc}</span>;
}
