import { prisma } from "@/lib/db/klient";

export const dynamic = "force-dynamic";

export default async function Strona() {
  const [obszary, zawody, kierunki, drogi, klastry] = await Promise.all([
    prisma.obszar.count(),
    prisma.zawod.count(),
    prisma.kierunek.count(),
    prisma.drogaBezStudiow.count(),
    prisma.klaster.count(),
  ]);

  const pozycje: Array<[string, number]> = [
    ["obszary zawodowe", obszary],
    ["zawody", zawody],
    ["kierunki studiów", kierunki],
    ["drogi bez studiów", drogi],
    ["klastry", klastry],
  ];

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-xl font-semibold">Program doradztwa zawodowego 16–24</h1>
      <p className="mt-2 text-sm text-stone-600">
        Faza 1: fundament i dane. Interfejs uczestnika powstaje w fazie 3.
      </p>
      <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200 text-sm">
        {pozycje.map(([nazwa, ile]) => (
          <div key={nazwa} className="flex justify-between py-2">
            <dt className="text-stone-600">{nazwa}</dt>
            <dd className="font-medium tabular-nums">{ile}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
