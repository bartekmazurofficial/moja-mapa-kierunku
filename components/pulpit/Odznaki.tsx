/**
 * Male odznaki na karcie zawodu.
 *
 * `Pasmo` niesie zdanie o dopasowaniu, `Flaga` ostrzezenie albo wyroznienie.
 * Oba sa tylko etykietami: **zaden kolor nie niesie tu informacji sam**, bo
 * obok zawsze stoi slowo.
 */

export function Pasmo({ opis }: { pasmo?: string; opis: string }) {
  // Pasmo bez opisu nie ma czego pokazac. Wczesniej wypadal tu kod techniczny
  // („ponizej_progu"), ktory trafial wprost na ekran uczestnika.
  if (!opis) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-akcent-tlo px-2.5 py-0.5 text-drobne text-akcent">
      {opis}
    </span>
  );
}

const STYLE_FLAG: Record<string, string> = {
  trampolina: "bg-trampolina-tlo text-trampolina",
  koszt: "bg-koszt-tlo text-koszt",
  zagrozony: "bg-przyszlosc-tlo text-przyszlosc",
  uwaga: "bg-uwaga-tlo text-uwaga",
};

export function Flaga({
  rodzaj,
  children,
}: {
  rodzaj: keyof typeof STYLE_FLAG;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-drobne ${STYLE_FLAG[rodzaj]}`}>
      {children}
    </span>
  );
}
