# Platforma programu doradztwa zawodowego 16–24

Fundacja Służąc Życiu. Wersja na pilotaż, nie produkt.

Pełna specyfikacja programu leży w `program-doradztwa/`. Aplikacja jest jej
implementacją i nie wprowadza własnych decyzji merytorycznych — miejsca, w
których musiała, są opisane w `DECYZJE.md`.

## Uruchomienie

```bash
npm install
cp .env.example .env      # ustaw PROWADZACY_HASLO i SESJA_SEKRET
npm run setup             # parser obszarów + schemat bazy + import danych
npm run dev
```

`npm run setup` wykonuje po kolei:

| Krok | Co robi |
|---|---|
| `npm run parse:obszary` | zamienia `03_dane/obszary_27_opis.md` na `data/generated/obszary.json` |
| `npm run db:push` | tworzy schemat SQLite z `prisma/schema.prisma` |
| `npm run import` | waliduje i importuje cztery bazy referencyjne |

Import niczego nie zapisuje, dopóki nie zwaliduje całości. Baza w połowie
zaimportowana jest gorsza niż jej brak, bo silnik policzy na niej wynik.

## Testy

```bash
npm test
```

## Struktura

```
app/                Next.js App Router
lib/domain/         słowniki modułów, słowniki kart, typy domenowe
lib/db/             klient Prismy, mappery JSON, repozytorium
lib/engine/         silnik: czyste funkcje, bez bazy i bez UI (faza 2)
scripts/            parser bazy obszarów, import danych
tests/              testy regresyjne
program-doradztwa/  dokumentacja źródłowa, nie kod
```

## Grupa pilotażowa

```bash
npx tsx scripts/seed-grupa.ts "Pilotaż 2026"     # zakłada grupę i wypisuje kody dostępu
npx tsx scripts/wypelnij-testowo.ts <kod> analityczny   # wypełnia siedem modułów danymi testowymi
npx tsx scripts/policz-wynik.ts <kod>            # liczy pełny wynik z zapisanych odpowiedzi
npx tsx scripts/raport-luk.ts                    # luki między słownikami kart a modułami
npx tsx scripts/zrzuty.ts                        # zrzuty ekranu do przeglądu wizualnego
```

Kody dostępu są losowe i niewyliczalne: raport zawiera wizję życia, informacje
o zdrowiu i o sytuacji finansowej, więc nie ma ścieżki, która pozwalałaby
wyliczyć listę uczestników przez podmianę identyfikatora w adresie.
