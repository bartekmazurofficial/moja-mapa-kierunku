export const metadata = { title: "Panel prowadzącego" };

export default function Strona() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-czytelna flex-col justify-center px-6 py-16">
      <h1 className="font-serif text-naglowek">Panel prowadzącego</h1>
      <p className="proza mt-4 text-atrament-sciszony">
        Powstaje w fazie piątej: ekran grupy, ekran uczestnika, ekran sesji i korekta ręczna.
      </p>
    </main>
  );
}
