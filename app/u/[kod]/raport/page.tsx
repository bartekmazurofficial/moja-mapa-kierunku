import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { RaportWidok } from "@/components/raport/Raport";
import { pobierzRaport } from "@/lib/raport/serwer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Moja mapa kierunku" };

export default async function Strona({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const widok = await pobierzRaport(kod);
  if (!widok) notFound();

  return (
    <>
      <nav className="mx-auto max-w-artykul px-5 pt-6 sm:px-8">
        <Link href={`/u/${kod}`} className="text-male text-atrament-slaby hover:text-atrament">
          ← Wróć do listy
        </Link>
      </nav>
      <Suspense>
        <RaportWidok widok={widok} kodUczestnika={kod} />
      </Suspense>
    </>
  );
}
