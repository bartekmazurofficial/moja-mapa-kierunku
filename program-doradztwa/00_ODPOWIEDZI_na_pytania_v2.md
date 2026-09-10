# ODPOWIEDZI NA DZIESIĘĆ PYTAŃ

Dobre pytania, dziękuję. **Dwa z nich wykryły realne błędy w mojej dokumentacji**, oba już poprawione. Odpowiadam po kolei, wszystko wiążąco.

---

## 1. Harmonogram odsłaniania: **obowiązują scenariusze, nie moja tabela**

**Miałeś rację, tabela w poleceniu była przesunięta o jedno spotkanie.** Scenariusze są nadrzędne, bo pisałem je uważniej i to one odzwierciedlają logikę programu.

Obowiązujący harmonogram:

| Moment | Co się odblokowuje |
|---|---|
| Koniec spotkania 1 | punkt startu, **co mnie ciągnie**, **jak naturalnie działam** |
| Koniec spotkania 2 | **w czym mogę być dobry**, widoczne obok sekcji z tygodnia poprzedniego |
| Spotkanie 3 | **nic z wyników**. Wizja życia jest widoczna od razu, bo to własny tekst uczestnika, a nie wynik silnika |
| Spotkanie 4, część pierwsza | **wartości**, **idealne środowisko pracy**, **czego nie chcę**, **moje najmocniejsze obszary** |
| Spotkanie 4, część druga | **zawody**, **kierunki i drogi bez studiów**, **trzy drogi**, **antydopasowania** |
| Po sesji 1:1 | **podsumowanie rozmowy** |

**Tak, uczyń to danymi w bazie, nie stałą w kodzie.** Tabela `odslony` per grupa, jak proponujesz.

Jedna rzecz do pilnowania: **wartości i filtry zbierane są na spotkaniu 3, ale pokazywane dopiero na czwartym.** To nie pomyłka. Uczestnik ma między nimi tydzień na przetrawienie wizji życia, zanim zobaczy, co z tego wynika.

---

## 2. Poprawki scenariuszy zgodnie z audytami: **tak, z jednym wyjątkiem**

**A0 na początku spotkania 1** — tak, według `A0_punkt_startu.md` rozdział 6.

**Odwrócone spotkanie 3**, czyli wizja życia przed wartościami i filtrami — tak. To jest istotna poprawka: weto usuwa zawody bezwarunkowo i nie może być odruchem z piętnastej minuty.

**Ranking umiejętności na spotkaniu 2 zostaje.** Tu się nie zgadzam z Twoją interpretacją audytu. Audyt nie mówił, żeby go usunąć, tylko żeby **zmierzyć, czy nie jest redundantny wobec modułu A2**. To dwa różne pomiary tego samego konstruktu, co jest uczciwą metodologią, ale zajmuje 64 minuty, czyli jedną czwartą programu.

**Zaimplementuj pomiar:** po policzeniu wyników zapisz w bazie korelację między rankingiem kompetencji z modułu A2 a rankingiem z ćwiczenia 1–4. Jedna liczba na uczestnika. Po pilotażu zdecyduję. Jeśli przekroczy 0,80, skrócę ćwiczenie o połowę.

---

## 3. Progi wyprowadzania profilu: **przyjmuję Twoją propozycję z jedną poprawką**

Progi są dobre, ale **potrzebują górnego limitu**, inaczej rozsypie się mnożnik kartowy.

Karty mają 2–4 kody A1 i 3 kody A2. Jeśli uczestnik przekroczy próg w dwunastu obszarach, pokrycie wyjdzie sztucznie wysokie u wszystkich zawodów naraz i mnożnik przestanie różnicować.

```
a1     = obszary z Z > 60,   ale maksymalnie 6 najwyższych
a2     = kompetencje K > 60, ale maksymalnie 8 najwyższych
a3     = bieguny o sile > 65, maksymalnie 5
a5_nie = wszystkie pozycje z odpowiedzią NIE, bez limitu, bez wet
```

**Tak, do `config.ts` jako piąta grupa liczb strojonych po pilotażu.** I dziękuję, że uprzedziłeś, że wprowadzasz liczby spoza specyfikacji. Dokładnie tak chcę pracować.

**Dopisz do testów:** przy każdym z trzech profili kontrolnych sprawdź, że wyprowadzony zbiór A1 ma od 3 do 6 elementów. Jeśli wyjdzie 1 albo 6 przy każdym profilu, progi są źle dobrane i chcę o tym wiedzieć od razu.

---

## 4. Antyprofil: **przyjmuję alternatywę, tabelę odwzorowania dostarczę ja**

Słusznie, że nie robisz tego sam. **Odwzorowanie 60 kodów antyprofilu na odpowiedzi z modułów jest decyzją merytoryczną, nie techniczną.**

Rób tak, jak proponujesz: zakoduj te, które odwzorowują się jednoznacznie, resztę zostaw nieaktywną i **wypisz mi pełną listę kodów, których nie zakodowałeś**, wraz z uzasadnieniem, dlaczego są niejednoznaczne. Dostarczę tabelę uzupełniającą.

Do czasu jej dostarczenia **antyprofil ma działać częściowo, a nie blokować fazy**. Nieaktywny kod po prostu nigdy nie trafia.

---

## 5. Obszar 11 „Dźwięk i muzyka": **znalazłeś realny błąd, już poprawiony**

To była dziura w mojej bazie, nie w Twoim rozumieniu. Moduł A1 ma **24 obszary zainteresowań**, a przy kodowaniu 157 zawodów użyłem **23**. Brakowało dokładnie obszaru 11.

**Poprawione po mojej stronie.** W paczce, którą dostajesz zaktualizowaną, kod `dzwiek` jest w słowniku, a trzy zawody mają poprawiony profil:

| Zawód | Było | Jest |
|---|---|---|
| muzyk | `scena precyzja rece` | `dzwiek scena rece` |
| nauczyciel_muzyki | `uczenie scena precyzja` | `uczenie dzwiek scena` |
| realizator_dzwieku | `tech scena precyzja` | `dzwiek tech precyzja` |

Walidacja po poprawce: **24 kody A1 na 24, osiągalność 157 na 157, różnorodność TOP3 0,809, zero zawodów przegrywających własny profil.**

**Weź nowy `zawody_baza.json`.** Stary miał 23 kody i dawał niepełny wynik osobom o profilu muzycznym.

---

## 6. Dwanaście warunków A5 bez pozycji w module: **wypisz listę, ja rozstrzygnę**

Domyślnie rób jak proponujesz: **zostaw nieaktywne i wypisz listę** w raporcie z fazy 2.

Ale nie zostawimy tego tak na stałe. **Rozszerzenie modułu A5 jest moją decyzją i mogę je podjąć**, bo A5 ma 32 pozycje i dopisanie kilku niczego nie psuje. Zakaz „nie zmieniaj treści pozycji" dotyczy modyfikowania istniejących, nie dopisywania brakujących.

Podejrzewam, że na liście będą co najmniej: kontakt ze śmiercią, agresja, praca w ciasnocie, praca na wysokości, praca z chemikaliami. **Wszystkie pięć są w kartach jako realne wymogi i wszystkie zasługują na pozycję w module.**

---

## 7. Reguła składania klastra: **przyjmuję, plus jedna reguła dodatkowa**

Twoja propozycja jest zgodna ze specyfikacją: wynik klastra to najwyższy wynik ze składu, gwarancje liczone przez skład, próg 55 stosowany do wyniku klastra.

**Dodaj regułę, której nie było w specyfikacji:**

> Jeśli powyżej progu 55 znajduje się **tylko jeden** zawód z klastra, pokaż go jako pojedynczy zawód, bez nazwy zbiorczej i bez pytania rozstrzygającego.

Powód: pokazywanie klastra „Opieka pielęgniarska i położnictwo" osobie, u której położna wypadła poniżej progu, sugeruje wybór, którego nie ma.

---

## 8. PDF przez `@react-pdf/renderer`: **tak**

Zgadzam się z Twoim rozróżnieniem. Zakaz dotyczył bibliotek komponentów UI, bo chcę kontrolować wygląd interfejsu. Biblioteka renderująca PDF to co innego.

Warunek: **poprawne polskie znaki**, sprawdzone na raporcie zawierającym „ą ę ć ł ń ó ś ź ż" w nagłówkach i w tabelach.

---

## 9. Konto prowadzącego: **tak**

Jedno konto, hasło ze zmiennej środowiskowej, sesja w podpisanym ciasteczku, bez tabeli użytkowników.

**Dwa warunki dotyczące uczestnika:**

Kod dostępu **nie może być zgadywalny ani wyliczalny**. Nie numeracja kolejna, tylko losowy ciąg. Raport zawiera wizję życia, informacje o zdrowiu i sytuacji finansowej, więc wyciek jest poważniejszy niż w typowej aplikacji.

**Brak możliwości wyliczenia listy uczestników** przez podmianę identyfikatora w adresie.

---

## 10. Tabele: **dziewięć plus `odslony`, plus jedna, której zabrakło**

Twoja lista jest poprawna, a moje polecenie faktycznie mówiło „siedem" i wyliczało osiem. Przepraszam za bałagan.

Ale **brakuje jednej tabeli: `grupy`.**

Uzasadnienie: `odslony` dotyczą całej grupy, nie pojedynczego uczestnika, bo prowadzący odblokowuje warstwę jednym kliknięciem dla wszystkich. Bez tabeli grup nie ma do czego przypiąć odsłon ani harmonogramu spotkań.

**Docelowo dziesięć tabel:**

```
grupy · uczestnicy · punkt_startu · odpowiedzi · wyniki · odslony
zawody · kierunki · drogi_bez_studiow · klastry · obszary
```

To jedenaście, licząc `obszary`. Nie liczę literalnie, liczy się kompletność.

---

# PODSUMOWANIE

**Zatwierdzam wszystko, co zaproponowałeś, z czterema poprawkami:**

1. Limity górne przy wyprowadzaniu profilu, punkt 3
2. Ranking umiejętności zostaje, dochodzi pomiar korelacji, punkt 2
3. Reguła pojedynczego zawodu z klastra, punkt 7
4. Tabela `grupy`, punkt 10

**Dwa Twoje pytania wykryły błędy w mojej dokumentacji:** przesunięty harmonogram odsłaniania i brakujący kod dźwięku. Oba poprawione, dane zaktualizowane.

**Weź nową paczkę danych, zanim zaczniesz fazę 1.** Zmienił się `zawody_baza.json` i słownik kodów A1.

**Możesz zaczynać fazę 1.**

Jeszcze raz: pytaj, gdy specyfikacja jest niejednoznaczna, i mów mi, gdy znajdziesz w niej błąd. Dwa z dziesięciu pytań okazały się błędami po mojej stronie i wolę je usłyszeć teraz niż po zbudowaniu silnika.
