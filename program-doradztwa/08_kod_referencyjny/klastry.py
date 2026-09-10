# -*- coding: utf-8 -*-
"""
KLASTRY ZAWODOWE
26 grup zawodow, ktorych assessment nie rozroznia.
Kazdy ma nazwe zbiorcza, pytanie rozstrzygajace i wyjasnienie roznicy.
"""

KLASTRY = {

"marketing_tresc": dict(
    nazwa="Marketing i tworzenie tresci",
    sklad=["spec_marketingu","copywriter"],
    pytanie="Chcesz odpowiadac za to, czy kampania zadziala, czy za to, jak brzmi tekst?",
    roznica="Marketer prowadzi calosc i jest rozliczany z wyniku sprzedazowego. Copywriter odpowiada za slowo i pracuje zwykle na wlasny rachunek, dla wielu klientow.",
    uwaga="Oba segmenty masowe sa mocno zagrozone. Marketer powinien celowac w analityke, copywriter w branzowosc."),

"sprzedaz_terenowa": dict(
    nazwa="Sprzedaz w terenie",
    sklad=["handlowiec","agent_nieruchomosci"],
    pytanie="Wolisz stala pensje z prowizja, czy dochod wylacznie prowizyjny przy znacznie wyzszym suficie?",
    roznica="Przedstawiciel ma podstawe i samochod od pracodawcy. Agent nieruchomosci zarabia wylacznie od transakcji, a od pozyskania oferty do wyplaty mija 2 do 6 miesiecy.",
    uwaga="Agent wymaga zabezpieczenia finansowego na 6 do 12 miesiecy. To warunek praktyczny, nie preferencja."),

"ksiegowosc": dict(
    nazwa="Ksiegowosc i rozliczenia",
    sklad=["ksiegowy","glowny_ksiegowy","spec_plac"],
    pytanie="Chcesz odpowiadac za rozliczenia firmy, za calosc ksiag z podpisem wlasnym nazwiskiem, czy za wynagrodzenia konkretnych ludzi?",
    roznica="Ksiegowy prowadzi. Glowny ksiegowy podpisuje sprawozdanie i odpowiada osobiscie, takze karnie. Specjalista plac liczy pensje, gdzie kazdy blad dotyczy czyichs pieniedzy i wychodzi tego samego dnia.",
    uwaga="Do glownego ksiegowego nie ma szybkiej drogi. Wymaga 6 do 10 lat i certyfikatow."),

"analiza_fin": dict(
    nazwa="Analiza i kontrola finansowa",
    sklad=["analityk_finansowy","kontroler_finansowy"],
    pytanie="Wolisz patrzec w przod i oceniac, czy to sie oplaci, czy pilnowac na biezaco, czy firma trzyma budzet?",
    roznica="Analityk pracuje z modelami i prognozami, wiecej samotnie. Kontroler pracuje z ludzmi, ktorzy wydaja pieniadze, i musi im mowic, ze nie ma na cos srodkow.",
    uwaga="Kontroler jest z definicji w opozycji do dzialow operacyjnych. To codzienne, nie okazjonalne."),

"admin_biuro": dict(
    nazwa="Administracja i obsluga",
    sklad=["office_manager","obsluga_klienta"],
    pytanie="Wolisz ogarniac wszystko, co dzieje sie w firmie, czy rozmawiac z klientami przez caly dzien?",
    roznica="Office manager prowadzi kilkanascie spraw naraz, negocjuje z dostawcami i zarzadza budzetem biura. Obsluga klienta to kilkadziesiat rozmow dziennie, w wiekszosci z osobami niezadowolonymi.",
    uwaga="Obsluga klienta jest jednym z najbardziej zagrozonych zawodow w bazie. Traktuj jako pierwsza prace, nie jako kariere."),

"dane": dict(
    nazwa="Analiza danych",
    sklad=["analityk_danych","data_scientist"],
    pytanie="Chcesz odpowiadac na pytania, ktore ktos zadaje, czy budowac modele przewidujace przyszlosc?",
    roznica="Analityk pracuje z SQL i danymi historycznymi, wchodzi po studiach dowolnych albo bez nich. Data scientist buduje modele i wymaga matematyki na poziomie studiow scislych.",
    uwaga="Matematyka jest tu twarda bariera. Jesli sprawia trudnosc, analityk danych jest realna droga, data scientist nie."),

"prawnicy": dict(
    nazwa="Zawody prawnicze",
    sklad=["radca_prawny","prawnik_wewnetrzny"],
    pytanie="Wielu klientow i rozliczenie z godzin, czy jedna firma i etat?",
    roznica="Radca prowadzi wlasna praktyke, ma nieprzewidywalne godziny i wyzszy sufit. Prawnik wewnetrzny ma stala pensje, przewidywalny grafik i jednego klienta, ktorym jest jego pracodawca.",
    uwaga="Obie drogi wymagaja aplikacji, czyli 8 do 9 lat od matury."),

"prawo_urzad": dict(
    nazwa="Prawo w strukturze",
    sklad=["spec_zgodnosci","notariusz"],
    pytanie="Chcesz pilnowac, zeby firma dzialala zgodnie z przepisami, czy nadawac dokumentom moc prawna?",
    roznica="Specjalista zgodnosci pracuje w firmie i doradza. Notariusz prowadzi wlasna kancelarie, obsluguje klientow i odpowiada za czynnosci o skutkach majatkowych.",
    uwaga="Notariat wymaga aplikacji i jest bardzo trudny do wejscia. Zgodnosc jest dostepna po studiach."),

"mundurowe": dict(
    nazwa="Sluzby mundurowe",
    sklad=["policjant","zolnierz"],
    pytanie="Chcesz pracowac w spoleczenstwie, czy w strukturze zamknietej?",
    roznica="Policjant kontaktuje sie z obywatelami codziennie, czesto w konflikcie. Zolnierz pracuje wewnatrz jednostki, z wyjazdami i mozliwoscia przeniesienia sluzbowego.",
    uwaga="Obie sluzby oznaczaja gotowosc do przeprowadzki na polecenie."),

"ratownictwo_teren": dict(
    nazwa="Ratownictwo w terenie",
    sklad=["strazak","ratownik_gorski"],
    pytanie="Chcesz stabilnego etatu w jednostce, czy pracy sezonowej i czesciowo ochotniczej?",
    roznica="Strazak ma etat, dyzury i pelne zabezpieczenie socjalne. Ratownik gorski lub wodny czesto laczy to z inna praca, a zatrudnienie bywa sezonowe.",
    uwaga="Oba wymagaja bardzo dobrej sprawnosci fizycznej utrzymywanej przez cala kariere."),

"infra_it": dict(
    nazwa="Infrastruktura IT",
    sklad=["administrator","devops"],
    pytanie="Chcesz utrzymywac systemy, ktore juz dzialaja, czy budowac sposob, w jaki oprogramowanie trafia na produkcje?",
    roznica="Administrator dba o serwery i sprzet, czesto w jednej organizacji. DevOps automatyzuje procesy wdrozeniowe i pracuje blizej programistow. Sufit zarobkowy jest wyzszy.",
    uwaga="Obie role oznaczaja dyzury i telefon w srodku nocy przy awarii."),

"budowlanka_biuro": dict(
    nazwa="Budownictwo od strony biura",
    sklad=["inzynier_budownictwa","kosztorysant","projektant_instalacji"],
    pytanie="Chcesz liczyc, czy budynek sie utrzyma, ile bedzie kosztowal, czy jak doprowadzic do niego cieplo i wode?",
    roznica="Konstruktor odpowiada za bezpieczenstwo i podpisuje sie imiennie. Kosztorysant liczy pieniadze i ma najnizszy poziom stresu z calej trojki. Projektant instalacji pracuje w obszarze, ktory rosnie najszybciej z powodu wymogow energetycznych.",
    uwaga="Kosztorysant jest najlepsza droga dla kogos, kto pracowal fizycznie na budowie i musi przejsc do biura."),

"instalacje": dict(
    nazwa="Instalacje w budynkach",
    sklad=["elektryk","hydraulik"],
    pytanie="Prad czy woda?",
    roznica="To jest ta sama logika pracy: diagnoza, montaz, wyjazdy do klienta, wlasna dzialalnosc po kilku latach. Elektryk czesciej pracuje w kurzu na budowie, hydraulik czesciej w kontakcie z kanalizacja i przy awariach o dowolnej porze.",
    uwaga="Oba sa deficytowe w calej Polsce i oba korzystaja na transformacji energetycznej. Trudno tu o zly wybor."),

"rzemioslo_material": dict(
    nazwa="Rzemioslo materialowe",
    sklad=["stolarz","krawiec"],
    pytanie="Drewno czy tkanina?",
    roznica="Poza materialem to bardzo podobna praca: pomiar u klienta, wykonanie w warsztacie, montaz albo przymiarka. Stolarstwo wymaga wiekszej sily i drozszego warsztatu, krawiectwo jest tansze w starcie i mniej obciazajace fizycznie.",
    uwaga="W obu produkcja masowa jest zagrozona, a wyroby na wymiar nie."),

"serwis_techniczny": dict(
    nazwa="Serwis i naprawa",
    sklad=["mechanik","technik_serwisu"],
    pytanie="Pojazdy czy urzadzenia?",
    roznica="Ta sama logika diagnozy. Mechanik pracuje w warsztacie, klient przyjezdza do niego. Technik serwisu jezdzi do urzadzen, wiec spedza jedna czwarta czasu w samochodzie.",
    uwaga="U technika serwisu wybor specjalizacji zmienia dochod dwukrotnie. Serwis medyczny i przemyslowy placa najlepiej, AGD najgorzej."),

"transport_biuro": dict(
    nazwa="Transport od strony biura",
    sklad=["spedytor","dyspozytor"],
    pytanie="Chcesz negocjowac z firmami transportowymi, czy zarzadzac wlasnymi kierowcami?",
    roznica="Spedytor szuka przewoznikow na rynku i zarabia na marzy, czesto z prowizja. Dyspozytor zarzadza wlasna flota i przede wszystkim ludzmi, ktorzy sa zmeczeni po tygodniu w trasie.",
    uwaga="Oba oznaczaja telefon dzwoniacy przez caly dzien i czesto po godzinach."),

"pielegniarstwo": dict(
    nazwa="Opieka pielegniarska i poloznictwo",
    sklad=["pielegniarka","polozna"],
    pytanie="Odpowiedzialnosc za jedna osobe, czy za dwie naraz?",
    roznica="Polozna prowadzi porod fizjologiczny samodzielnie, bez lekarza, i odpowiada jednoczesnie za matke i dziecko. Pielegniarka ma szerszy zakres miejsc pracy i wiecej sciezek: oddzial, przychodnia, blok operacyjny, opieka domowa.",
    uwaga="U poloznej najciezszym doswiadczeniem jest porod zakonczony smiercia dziecka. Zdarza sie rzadko, ale zdarza."),

"opieka_bezposrednia": dict(
    nazwa="Opieka bezposrednia",
    sklad=["opiekun_med","opiekun_starszej"],
    pytanie="Chcesz pracowac w placowce z zespolem, czy u jednej osoby, czesto samotnie?",
    roznica="Opiekun medyczny pracuje w szpitalu albo zakladzie opiekunczym, ma zespol i wieksze uprawnienia. Opiekun osoby starszej czesto pracuje sam w domu podopiecznego, takze za granica w systemie rotacyjnym.",
    uwaga="Praca za granica w opiece daje 2 do 3 razy wyzszy dochod, ale oznacza tygodnie albo miesiace poza domem."),

"cialo_terapia": dict(
    nazwa="Praca z cialem",
    sklad=["fizjoterapeuta","masazysta"],
    pytanie="Piec lat studiow i pelne uprawnienia medyczne, czy rok kursu i szybkie wejscie?",
    roznica="Fizjoterapeuta diagnozuje, prowadzi terapie i pracuje z pacjentami po urazach i operacjach. Masazysta wykonuje zabiegi, nie diagnozuje i nie moze prowadzic rehabilitacji.",
    uwaga="Oba zawody zuzywaja rece. Masazysta szybciej, bo pracuje wylacznie manualnie."),

"pomoc_psych": dict(
    nazwa="Pomoc psychologiczna",
    sklad=["psycholog","psychoterapeuta"],
    pytanie="Diagnoza i ocena, czy prowadzenie jednej osoby przez lata?",
    roznica="Psycholog bada, diagnozuje, wydaje opinie i pracuje w szkole, poradni, szpitalu albo firmie. Psychoterapeuta prowadzi terapie, co wymaga czteroletniej szkoly po studiach.",
    uwaga="Droga do psychoterapii kosztuje 60 do 120 tysiecy zlotych wlasnych srodkow. Wiedz o tym przed wyborem studiow, a nie po nich."),

"praca_z_rodzina": dict(
    nazwa="Praca z rodzina w kryzysie",
    sklad=["pracownik_socjalny","asystent_rodziny"],
    pytanie="Chcesz miec narzedzia formalne i decydowac o swiadczeniach, czy budowac zaufanie bez funkcji kontrolnej?",
    roznica="Pracownik socjalny przyznaje swiadczenia i prowadzi postepowania, wiec ma wladze i zwiazana z nia nieufnosc. Asystent rodziny pracuje intensywnie z kilkunastoma rodzinami, bez funkcji kontrolnej, i to jest jego najwieksza sila.",
    uwaga="U obu superwizja jest warunkiem bezpiecznej pracy. Pytaj o nia na rozmowie o prace tak samo jak o wynagrodzenie."),

"szkola": dict(
    nazwa="Nauczanie w szkole",
    sklad=["nauczyciel","pedagog_specjalny"],
    pytanie="Chcesz uczyc przedmiotu cala klase, czy pracowac indywidualnie z uczniami, dla ktorych zwykla szkola jest za trudna?",
    roznica="Nauczyciel prowadzi 30-osobowa grupe i realizuje program. Pedagog specjalny pracuje z pojedynczymi uczniami, dostosowuje material i widzi postepy mierzone w miesiacach.",
    uwaga="Pedagog specjalny jest najszybciej rosnacym zawodem w calej edukacji i ma realna mozliwosc terapii prywatnej."),

"projektowanie_wiz": dict(
    nazwa="Projektowanie wizualne",
    sklad=["grafik","projektant_ux"],
    pytanie="Chcesz decydowac, jak cos wyglada, czy jak sie tego uzywa?",
    roznica="Grafik pracuje z forma i marka, czesto na wlasny rachunek. Projektant UX bada uzytkownikow, podejmuje decyzje o strukturze produktu i musi je uzasadniac danymi, nie gustem.",
    uwaga="Grafika w warstwie wykonawczej jest mocno zagrozona. Rynek wejsciowy UX jest przesycony. Oba wymagaja bardzo dobrego portfolio."),

"gastro_zarzadzanie": dict(
    nazwa="Zarzadzanie w gastronomii",
    sklad=["szef_kuchni","menedzer_restauracji"],
    pytanie="Odpowiadasz za kuchnie, czy za caly lokal?",
    roznica="Szef kuchni odpowiada za menu, koszt surowca i zespol kuchni. Menedzer odpowiada za rentownosc calego lokalu, obsluge, opinie w internecie i formalnosci.",
    uwaga="Do obu prowadzi tylko droga przez lata pracy w gastronomii. Bez tego zespol nie uzna autorytetu."),

"uroda": dict(
    nazwa="Uroda i pielegnacja",
    sklad=["fryzjer","kosmetolog"],
    pytanie="Wlosy czy skora?",
    roznica="Fryzjerstwo ma nizszy prog wejscia i tanszy wlasny salon. Kosmetologia wymaga wiekszej wiedzy o skorze i drozszej aparatury, ale ma wyzszy sufit i wieksze mozliwosci specjalizacji.",
    uwaga="Oba oznaczaja stanie przez caly dzien i kontakt z preparatami. Alergie kontaktowe sa czesta przyczyna odejscia z zawodu."),

"wlasna_firma": dict(
    nazwa="Wlasna firma",
    sklad=["wlasciciel_uslugowej","wlasciciel_lokalu"],
    pytanie="Chcesz sprzedawac usluge, ktora wykonujesz z ekipa, czy prowadzic miejsce, do ktorego ludzie przychodza?",
    roznica="Firma uslugowa ma nizsze koszty stale i mozna ja zaczac malutko. Lokal gastronomiczny wymaga od 150 tysiecy zlotych i rezerwy na 12 miesiecy, a wiekszosc lokali nie osiaga trwalej rentownosci.",
    uwaga="Obie drogi wymagaja najpierw fachu. Przedsiebiorczosc jest nadbudowa nad kompetencja, nie jej zamiennikiem."),
}

# ---- reguly prezentacji ----
REGULY = """
1. Klaster pokazywany jest jako jedna pozycja w rankingu, z nazwa zbiorcza.
2. Wynik klastra = najwyzszy wynik zawodu w klastrze.
3. Uczestnik zawsze widzi pytanie rozstrzygajace i wyjasnienie roznicy.
4. Karty wszystkich zawodow z klastra sa dostepne do przeczytania.
5. Rozstrzygniecie klastra jest obowiazkowym punktem sesji indywidualnej.
6. Pole 'uwaga' jest pokazywane zawsze, takze gdy brzmi niewygodnie.
"""

if __name__ == "__main__":
    print(f"klastrow: {len(KLASTRY)}")
    print(f"zawodow w klastrach: {sum(len(v['sklad']) for v in KLASTRY.values())}")
    braki = [k for k,v in KLASTRY.items() if not v.get("pytanie") or not v.get("uwaga")]
    print(f"klastrow bez pytania albo uwagi: {len(braki)} {braki}")
