import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RaportKoncowy } from "@/components/raport/RaportKoncowy";
import { pobierzRaport } from "@/lib/raport/serwer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moja mapa kierunku" };

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const widok = await pobierzRaport(kod);
  if (!widok) notFound();

  // Nawigacja stoi w pulpicie po lewej, więc raport nie powtarza linku wstecz.
  return (
    <Suspense>
      <RaportKoncowy widok={widok} kodUczestnika={kod} />
    </Suspense>
  );
}
