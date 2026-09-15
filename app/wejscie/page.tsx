import Link from "next/link";
import { WejscieKodem } from "@/components/WejscieKodem";
import { Bramy } from "@/components/pulpit/Bramy";
import { Znak } from "@/components/pulpit/Znak";
import { trybTestowy } from "@/lib/tryb";
import { ListaTestowa } from "@/components/ListaTestowa";
import { PokazDemo } from "@/components/PokazDemo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wejście dla uczestnika" };

export default function Strona() {
  const testowy = trybTestowy();

  return (
    <main className="mx-auto flex min-h-dvh max-w-[76rem] items-center px-5 py-10 sm:px-8">
      <div className="szklo relative w-full overflow-hidden p-8 sm:p-12">
        <Bramy klasa="pointer-events-none absolute -right-10 bottom-0 hidden h-[20rem] w-[28rem] opacity-70 lg:block" />

        <div className="relative max-w-[48rem]">
          <Link
            href="/"
            className="przejscie inline-flex items-center gap-2 text-male text-atrament-slaby hover:text-atrament"
          >
            <span aria-hidden>←</span> Wróć
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <Znak rozmiar={40} />
            <span>
              <span className="block text-tresc-duza font-extrabold tracking-tight">DreamWork</span>
              <span className="block text-drobne uppercase tracking-[0.14em] text-atrament-slaby">
                wejście dla uczestnika
              </span>
            </span>
          </div>

          <h1 className="mt-8 text-naglowek-duzy font-extrabold leading-tight tracking-tight">
            Wpisz kod
            <br />
            <span className="gradient-tytul">od prowadzącego.</span>
          </h1>
          <p className="proza mt-4">
            Bez rejestracji, bez hasła, bez zakładania konta. Kod jest jednocześnie adresem
            Twojego raportu, więc zachowaj go dla siebie.
          </p>

          <div className="mt-8">
            <WejscieKodem />
          </div>

          <PokazDemo />

          {testowy ? <ListaTestowa /> : null}
        </div>
      </div>
    </main>
  );
}
