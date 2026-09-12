# Wdrożenie testowe: Vercel + Supabase

Stan: **wszystko po mojej stronie gotowe.** Brakuje jednej rzeczy, której nie
mogę zrobić za Ciebie: projektu w Supabase. Zakładanie kont i logowanie się
w cudzym imieniu to jedyna rzecz, której nie robię.

Vercel jest już zalogowany na tym komputerze (`mazurkas2006-5330`), więc
wdrożenie aplikacji zrobię sam.

---

## Co musisz mi dać

**Jedna rzecz: dwa adresy połączenia z Supabase.**

1. Wejdź na [supabase.com](https://supabase.com), załóż projekt (darmowy plan
   wystarczy na pilotaż).
2. **Project Settings → Database → Connection string**.
3. Skopiuj mi dwa adresy, oba z wklejonym hasłem w miejsce `[YOUR-PASSWORD]`:

| Co | Gdzie w Supabase | Port |
|---|---|---|
| **Transaction pooler** | zakładka „Transaction pooler” | 6543 |
| **Session / Direct** | zakładka „Session pooler” albo „Direct connection” | 5432 |

Wyglądają tak:

```
postgresql://postgres.abcdefgh:HASLO@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
postgresql://postgres.abcdefgh:HASLO@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Dlaczego dwa.** Aplikacja na Vercelu jest bezserwerowa: każde żądanie otwiera
własne połączenie. Bez puli dwunastu uczestników naraz wyczerpie limit Supabase
w kilka sekund. Ale pula nie obsługuje poleceń zmieniających schemat, więc do
założenia tabel potrzebne jest połączenie bezpośrednie. Stąd `DATABASE_URL`
i `DIRECT_URL`.

---

## Co zrobię po otrzymaniu adresów

| # | Krok | Czym |
|---|---|---|
| 1 | Założę tabele w Supabase | `npm run wdroz:schemat` |
| 2 | Zaimportuję bazy referencyjne: 27 obszarów, 157 zawodów, 75 kierunków, 56 dróg bez studiów, 26 klastrów, 157 kart | `npm run wdroz:dane` |
| 3 | Założę grupę pilotażową i dwunastu uczestników | `scripts/seed-grupa.ts` |
| 4 | Ustawię zmienne środowiskowe na Vercelu | `vercel env add` |
| 5 | Wdrożę aplikację | `vercel --prod` |
| 6 | Sprawdzę na żywo: wejście kodem, moduł, raport, PDF, panel prowadzącego | ręcznie |
| 7 | Dam Ci adres, kody dostępu i hasło prowadzącego | |

---

## Co jest już zrobione

**Baza z SQLite na PostgreSQL.** Schemat ma jedno źródło: `prisma/schema.prisma`.
`scripts/schema-postgres.ts` generuje z niego wersję postgresową przy każdym
wdrożeniu, więc dwa pliki nie mają jak się rozjechać. Lokalnie nic się nie
zmienia: testy dalej chodzą na SQLite i są szybkie.

Pola listowe i mapy są trzymane jako tekst z JSON-em w środku, więc na
Postgresie stają się `text` i żadna warstwa domenowa nie wie o zmianie.
Zero zapytań surowych w kodzie, więc nie ma czego przepisywać.

**Fonty do PDF.** Renderer czyta je z dysku przy pierwszym żądaniu, a na
serwerze bezserwerowym do paczki funkcji trafia tylko to, co śledzenie
zależności samo znajdzie w importach. `outputFileTracingIncludes` w
`next.config.mjs` dokłada je ręcznie. Bez tego raport w PDF działa lokalnie
i wywala się na produkcji.

Fonty są generowane w czasie budowania (`npm run vercel-build`), więc nie muszą
leżeć w repozytorium.

**Nic do indeksowania.** `app/robots.ts` zabrania wszystkiego, a `metadata.robots`
dokłada `noindex`. Kod dostępu jest losowy i nie da się go zgadnąć, ale
wystarczy, że ktoś wklei swój link publicznie, żeby wyszukiwarka poszła dalej.
To nie jest zabezpieczenie, tylko zdjęcie jednej drogi wycieku, która nic
nie kosztuje.

---

## Decyzje, które proponuję

**`TRYB_TESTOWY` zostaje wyłączony.** Włączony pokazuje listę uczestników na
ekranie wejścia, żeby dało się wejść bez kodu. To jest wygodne na Twoim
komputerze i nie do przyjęcia pod publicznym adresem: raport zawiera wizję
życia, informacje o zdrowiu i o sytuacji finansowej. Dam Ci zamiast tego listę
kodów i gotowych adresów, po jednym na uczestnika.

Jeśli wolisz mimo to włączony, powiedz, ale wtedy adres nie może pójść dalej
niż do Ciebie.

**Hasło prowadzącego i sekret sesji wygeneruję losowo** i ustawię w Vercelu.
Hasło pokażę Ci raz, żebyś mógł je zapisać. Możesz je potem zmienić jedną
komendą.

**Dane w Supabase będą testowe.** Dwunastu uczestników z imionami Ania, Bartek,
Celina i tak dalej, wszyscy puści. Przed prawdziwym pilotażem zakładamy nową
grupę z prawdziwymi imionami i nowymi kodami.

---

## Czego jeszcze nie ma, a przed prawdziwym pilotażem być musi

Lista jest w `DECYZJE.md` i nie zmieniła się przez wdrożenie:

| # | Sprawdzenie |
|---|---|
| 1 | Pełna ścieżka na prawdziwym telefonie, Safari na iOS i Chrome na Androidzie |
| 2 | Zachowanie przy zerwanym połączeniu podczas zapisu odpowiedzi |
| 3 | Wydrukowany PDF, marginesy i podział stron na papierze A4 |
| 4 | Czytnik ekranu na jednym module i na raporcie |
| 5 | Sprawdzenie, że `TRYB_TESTOWY` nie jest ustawiony na produkcji |

Wdrożenie testowe załatwia punkt pierwszy: telefon wejdzie na prawdziwy adres,
a nie na `localhost`, więc wreszcie da się to sprawdzić naprawdę.
