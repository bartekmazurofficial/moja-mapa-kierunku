/**
 * MODUL A3: JAK NATURALNIE DZIALAM.
 *
 * 65 par dwubiegunowych, po piec na kazdy z 13 wymiarow. Os EFE dolozona
 * po fazie piatej. Format inny niz w A1 i A2 celowo: trzeci modul z rzedu
 * o tej samej mechanice oznaczalby klikanie bez czytania.
 *
 * Tresc: wersja druga banku (A3_pary_wersja2.md), podmieniona jeden do
 * jednego. Pierwsza wersja pisala bieguny skrotem („Wole zdazyc" kontra
 * „Wole miec pewnosc") i uczestnik musial dopowiadac sobie sytuacje albo
 * zagladac na druga strone, zeby zrozumiec pierwsza. Druga wersja nazywa
 * sytuacje w obu biegunach tymi samymi slowami, wiec porownywane jest samo
 * zachowanie.
 *
 * **Identyfikator, wymiar i strona bieguna sa niezmienne.** Biegun A musi
 * oznaczac ten sam koniec osi co wczesniej: od tego zalezy, ktory biegun
 * wygrywa w czesci A i jaka kotwice dostaje uczestnik w czesci B.
 */

export interface ParaA3 {
  id: string;
  wymiar: string;
  biegunA: string;
  biegunB: string;
}

export const PARY_A3: ParaA3[] = [
  {"id": "INI_1", "wymiar": "INI", "biegunA": "W grupowym zadaniu zaczynam robić swoje, zanim ktoś mi przydzieli rolę", "biegunB": "W grupowym zadaniu czekam, aż ktoś powie, co mam robić"},
  {"id": "INI_2", "wymiar": "INI", "biegunA": "Na spotkaniu grupy sam zgłaszam swój pomysł", "biegunB": "Na spotkaniu grupy mówię swój pomysł, gdy ktoś mnie zapyta"},
  {"id": "INI_3", "wymiar": "INI", "biegunA": "Kiedy widzę, że coś nie działa, sam się tym zajmuję", "biegunB": "Kiedy widzę, że coś nie działa, zgłaszam to osobie odpowiedzialnej"},
  {"id": "INI_4", "wymiar": "INI", "biegunA": "Wolę sam decydować, w którą stronę idzie wspólne zadanie", "biegunB": "Wolę, żeby ktoś inny wyznaczył kierunek wspólnego zadania"},
  {"id": "INI_5", "wymiar": "INI", "biegunA": "W nowej grupie odzywam się jako jeden z pierwszych", "biegunB": "W nowej grupie czekam, aż odezwą się inni"},
  {"id": "STR_1", "wymiar": "STR", "biegunA": "Zanim zacznę pracę, chcę mieć rozpisane wszystkie kroki", "biegunB": "Zaczynam pracę i układam kolejne kroki w trakcie"},
  {"id": "STR_2", "wymiar": "STR", "biegunA": "Chcę wiedzieć w poniedziałek, co będę robił w piątek", "biegunB": "Wolę, żeby plan tygodnia układał się z dnia na dzień"},
  {"id": "STR_3", "wymiar": "STR", "biegunA": "Zapisuję swoje zadania na liście i odhaczam je po kolei", "biegunB": "Trzymam swoje zadania w głowie i robię je, kiedy wypadnie"},
  {"id": "STR_4", "wymiar": "STR", "biegunA": "Kiedy w ostatniej chwili zmienia się plan, irytuje mnie to", "biegunB": "Kiedy w ostatniej chwili zmienia się plan, nabieram energii"},
  {"id": "STR_5", "wymiar": "STR", "biegunA": "Wolę, żeby zasady były spisane i żeby wszyscy ich przestrzegali", "biegunB": "Wolę, żeby zasady dało się nagiąć, gdy sytuacja tego wymaga"},
  {"id": "TEM_1", "wymiar": "TEM", "biegunA": "Wolę oddać swoją pracę szybko i poprawić ją, jeśli będzie trzeba", "biegunB": "Wolę oddać swoją pracę później, za to bez potrzeby poprawek"},
  {"id": "TEM_2", "wymiar": "TEM", "biegunA": "Wolę oddać pracę niedokończoną niż nie oddać jej wcale", "biegunB": "Wolę nie oddać pracy wcale niż oddać ją zrobioną byle jak"},
  {"id": "TEM_3", "wymiar": "TEM", "biegunA": "Nudzi mnie poprawianie szczegółów w czymś, co już działa", "biegunB": "Poprawianie szczegółów aż do skutku daje mi satysfakcję"},
  {"id": "TEM_4", "wymiar": "TEM", "biegunA": "Decyzję podejmuję szybko, opierając się na przeczuciu", "biegunB": "Decyzję podejmuję po sprawdzeniu wszystkich za i przeciw"},
  {"id": "TEM_5", "wymiar": "TEM", "biegunA": "Wolę oddać pracę w terminie, nawet jeśli nie jest idealna", "biegunB": "Wolę spóźnić się z pracą, ale mieć pewność, że jest dobra"},
  {"id": "SAM_1", "wymiar": "SAM", "biegunA": "Najlepiej pracuje mi się, kiedy jestem w pomieszczeniu sam", "biegunB": "Najlepiej pracuje mi się, kiedy ktoś siedzi obok mnie"},
  {"id": "SAM_2", "wymiar": "SAM", "biegunA": "Kiedy wokół mnie są ludzie, trudniej mi się skupić na zadaniu", "biegunB": "Kiedy wokół mnie są ludzie, łatwiej mi zabrać się do zadania"},
  {"id": "SAM_3", "wymiar": "SAM", "biegunA": "Wolę odpowiadać tylko za swoją część wspólnej pracy", "biegunB": "Wolę, żeby cała grupa odpowiadała za wspólną pracę razem"},
  {"id": "SAM_4", "wymiar": "SAM", "biegunA": "Trudny problem rozkładam na części w głowie, w ciszy", "biegunB": "Trudny problem rozkładam na części, rozmawiając o nim z kimś"},
  {"id": "SAM_5", "wymiar": "SAM", "biegunA": "Cały dzień pracy bez rozmowy z kimkolwiek mi nie przeszkadza", "biegunB": "Cały dzień pracy bez rozmowy z kimkolwiek mnie męczy"},
  {"id": "GLE_1", "wymiar": "GLE", "biegunA": "Wolę robić jedno zadanie, dopóki nie będzie skończone", "biegunB": "Wolę prowadzić kilka zadań jednocześnie"},
  {"id": "GLE_2", "wymiar": "GLE", "biegunA": "Lubię poznać jeden temat naprawdę dokładnie", "biegunB": "Lubię poznać wiele różnych tematów po trochu"},
  {"id": "GLE_3", "wymiar": "GLE", "biegunA": "Kiedy ktoś przerwie mi w połowie zadania, tracę wątek", "biegunB": "Kiedy ktoś przerwie mi w połowie zadania, wracam bez trudu"},
  {"id": "GLE_4", "wymiar": "GLE", "biegunA": "Wolę być bardzo dobry w jednej wąskiej dziedzinie", "biegunB": "Wolę znać się przyzwoicie na wielu dziedzinach"},
  {"id": "GLE_5", "wymiar": "GLE", "biegunA": "Kiedy mam kilka spraw naraz, zaczynam się w nich gubić", "biegunB": "Kiedy mam jedną sprawę przez cały dzień, zaczynam się nudzić"},
  {"id": "RYZ_1", "wymiar": "RYZ", "biegunA": "Wolę spróbować czegoś nowego i przekonać się, jak wyjdzie", "biegunB": "Wolę najpierw sprawdzić, czy coś zadziała, a potem próbować"},
  {"id": "RYZ_2", "wymiar": "RYZ", "biegunA": "Kiedy nie wiem, jak coś się skończy, robi się dla mnie ciekawie", "biegunB": "Kiedy nie wiem, jak coś się skończy, źle się z tym czuję"},
  {"id": "RYZ_3", "wymiar": "RYZ", "biegunA": "Wybrałbym pracę z niepewnym, ale wysokim zarobkiem", "biegunB": "Wybrałbym pracę ze stałym, ale niższym zarobkiem"},
  {"id": "RYZ_4", "wymiar": "RYZ", "biegunA": "Kiedy coś mi nie wyjdzie, traktuję to jako cenę za naukę", "biegunB": "Staram się działać tak, żeby nic mi nie wyszło źle"},
  {"id": "RYZ_5", "wymiar": "RYZ", "biegunA": "Wolę trudny projekt, w którym mogę zrobić coś dużego", "biegunB": "Wolę spokojny projekt, w którym wiem, że mi się uda"},
  {"id": "DEC_1", "wymiar": "DEC", "biegunA": "Chcę mieć wpływ na to, jak potoczy się wspólne zadanie", "biegunB": "Chcę dostać jasną informację, co mam w zadaniu zrobić"},
  {"id": "DEC_2", "wymiar": "DEC", "biegunA": "Wolę podejmować decyzje i odpowiadać za ich skutki", "biegunB": "Wolę dobrze wykonać swoją część i nie odpowiadać za całość"},
  {"id": "DEC_3", "wymiar": "DEC", "biegunA": "Kiedy ktoś inny decyduje za mnie, źle to znoszę", "biegunB": "Kiedy ktoś inny bierze decyzję na siebie, czuję ulgę"},
  {"id": "DEC_4", "wymiar": "DEC", "biegunA": "Chcę wiedzieć, dlaczego mamy zrobić coś akurat w ten sposób", "biegunB": "Wystarczy mi wiedzieć, co konkretnie mam zrobić"},
  {"id": "DEC_5", "wymiar": "DEC", "biegunA": "Wolę być osobą, która mówi grupie, co robimy dalej", "biegunB": "Wolę być osobą, która dostaje zadanie i dobrze je wykonuje"},
  {"id": "KON_1", "wymiar": "KON", "biegunA": "Kiedy nie zgadzam się z czyimś pomysłem, mówię to wprost", "biegunB": "Kiedy nie zgadzam się z czyimś pomysłem, zwykle tego nie mówię"},
  {"id": "KON_2", "wymiar": "KON", "biegunA": "Uważam, że kłótnię w grupie czasem trzeba przeprowadzić do końca", "biegunB": "Uważam, że kłótnia w grupie zwykle więcej psuje, niż daje"},
  {"id": "KON_3", "wymiar": "KON", "biegunA": "Jeśli ktoś zrobił coś źle, powiem mu o tym prosto w oczy", "biegunB": "Jeśli ktoś zrobił coś źle, raczej to przemilczę"},
  {"id": "KON_4", "wymiar": "KON", "biegunA": "Nieporozumienie z kimś wolę wyjaśnić tego samego dnia", "biegunB": "Nieporozumienie z kimś wolę przeczekać, zwykle samo mija"},
  {"id": "KON_5", "wymiar": "KON", "biegunA": "Kiedy w grupie robi się nerwowo, mnie to nie przeszkadza", "biegunB": "Kiedy w grupie robi się nerwowo, tracę ochotę do działania"},
  {"id": "NOW_1", "wymiar": "NOW", "biegunA": "Lubię robić rzeczy, których wcześniej nigdy nie robiłem", "biegunB": "Wolę robić rzeczy, które już dobrze znam"},
  {"id": "NOW_2", "wymiar": "NOW", "biegunA": "Kiedy codziennie robię to samo, zaczynam się nudzić", "biegunB": "Kiedy codziennie robię to samo, czuję się spokojnie"},
  {"id": "NOW_3", "wymiar": "NOW", "biegunA": "Chętnie zmieniam sposób, w jaki wykonuję swoje zadania", "biegunB": "Wolę trzymać się sposobu, który już mi się sprawdził"},
  {"id": "NOW_4", "wymiar": "NOW", "biegunA": "Kiedy trafiam w nowe miejsce, czuję przede wszystkim ciekawość", "biegunB": "Kiedy trafiam w nowe miejsce, czuję przede wszystkim napięcie"},
  {"id": "NOW_5", "wymiar": "NOW", "biegunA": "Wolę wymyślić własny sposób zrobienia czegoś", "biegunB": "Wolę zrobić coś dokładnie według gotowej instrukcji"},
  {"id": "NAP_1", "wymiar": "NAP", "biegunA": "Robię swoje zadania, nawet gdy nikt tego nie sprawdza", "biegunB": "Robię swoje zadania lepiej, gdy ktoś sprawdza postępy"},
  {"id": "NAP_2", "wymiar": "NAP", "biegunA": "Sam wyznaczam sobie terminy i sam ich pilnuję", "biegunB": "Bez terminu ustalonego przez kogoś odkładam sprawy na później"},
  {"id": "NAP_3", "wymiar": "NAP", "biegunA": "Do pracy wystarcza mi to, że temat mnie interesuje", "biegunB": "Do pracy potrzebuję oceny, zapłaty albo innej nagrody"},
  {"id": "NAP_4", "wymiar": "NAP", "biegunA": "Za zadanie zabieram się na długo przed terminem", "biegunB": "Za zadanie zabieram się, kiedy termin jest już blisko"},
  {"id": "NAP_5", "wymiar": "NAP", "biegunA": "Pamiętam o swoich zadaniach bez żadnych przypomnień", "biegunB": "Przypomnienia w telefonie realnie pomagają mi pamiętać"},
  {"id": "RYT_1", "wymiar": "RYT", "biegunA": "Wolę pracować po trochu, ale każdego dnia", "biegunB": "Wolę usiąść raz i zrobić wszystko za jednym razem"},
  {"id": "RYT_2", "wymiar": "RYT", "biegunA": "Wolę pracować w krótkich odcinkach, za to regularnie", "biegunB": "Wolę pracować w długich odcinkach, za to rzadziej"},
  {"id": "RYT_3", "wymiar": "RYT", "biegunA": "Wieczorem i w nocy pracuje mi się gorzej niż rano", "biegunB": "Wieczorem i w nocy pracuje mi się lepiej niż rano"},
  {"id": "RYT_4", "wymiar": "RYT", "biegunA": "Duże zadanie wolę rozłożyć na kilka tygodni", "biegunB": "Duże zadanie wolę zrobić w dwa intensywne dni"},
  {"id": "RYT_5", "wymiar": "RYT", "biegunA": "Kiedy każdy dzień wygląda podobnie, mam więcej energii", "biegunB": "Kiedy każdy dzień wygląda podobnie, zaczynam się nudzić"},
  {"id": "OTO_1", "wymiar": "OTO", "biegunA": "Żeby się skupić, potrzebuję zupełnej ciszy", "biegunB": "Potrafię się skupić nawet przy głośnej rozmowie obok"},
  {"id": "OTO_2", "wymiar": "OTO", "biegunA": "Bałagan na biurku utrudnia mi pracę", "biegunB": "Bałagan na biurku nie robi mi żadnej różnicy"},
  {"id": "OTO_3", "wymiar": "OTO", "biegunA": "Wolę pracować codziennie w tym samym miejscu", "biegunB": "Wolę zmieniać miejsca, w których pracuję"},
  {"id": "OTO_4", "wymiar": "OTO", "biegunA": "Wolę pracować przy biurku, które sam sobie urządziłem", "biegunB": "Mogę pracować przy dowolnym biurku, byle było wolne"},
  {"id": "OTO_5", "wymiar": "OTO", "biegunA": "Wolę pracować tam, gdzie jest cicho i spokojnie", "biegunB": "Wolę pracować tam, gdzie ciągle coś się dzieje"},
  {"id": "EFE_1", "wymiar": "EFE", "biegunA": "Wolę pracę, po której na koniec dnia widzę, co zrobiłem", "biegunB": "Nie przeszkadza mi praca, której efekt zobaczę dopiero za rok"},
  {"id": "EFE_2", "wymiar": "EFE", "biegunA": "Źle znoszę, gdy długo nie wiem, czy moja praca ma sens", "biegunB": "Potrafię długo pracować, nie wiedząc, czy coś z tego wyjdzie"},
  {"id": "EFE_3", "wymiar": "EFE", "biegunA": "Lubię zamykać zadania i odhaczać je jako skończone", "biegunB": "Nie przeszkadza mi, że jedno zadanie ciągnie się miesiącami"},
  {"id": "EFE_4", "wymiar": "EFE", "biegunA": "Wolę skończyć dziesięć małych zadań niż jedno duże", "biegunB": "Wolę skończyć jedno duże zadanie niż dziesięć małych"},
  {"id": "EFE_5", "wymiar": "EFE", "biegunA": "Ważne jest dla mnie, żeby ktoś zauważył, co zrobiłem", "biegunB": "Wystarczy mi, że sam wiem, że zrobiłem coś dobrze"},
];

/** Czesc B: kotwica waznosci. Tresc zalezy od bieguna, ktory wyszedl w czesci A. */
export interface KotwicaA3 {
  wymiar: string;
  tekstA: string;
  tekstB: string;
}

export const KOTWICE_A3: KotwicaA3[] = [
  {"wymiar": "INI", "tekstA": "żebym mógł sam wychodzić z inicjatywą", "tekstB": "żeby ktoś jasno mówił, czego ode mnie oczekuje"},
  {"wymiar": "STR", "tekstA": "żebym z góry wiedział, co będzie się działo", "tekstB": "żebym mógł działać bez sztywnego planu"},
  {"wymiar": "TEM", "tekstA": "żebym mógł pracować w szybkim tempie", "tekstB": "żebym miał czas zrobić rzecz dokładnie"},
  {"wymiar": "SAM", "tekstA": "żebym mógł pracować samodzielnie", "tekstB": "żebym miał ludzi wokół siebie przez cały dzień"},
  {"wymiar": "GLE", "tekstA": "żebym mógł skupić się na jednej rzeczy naraz", "tekstB": "żebym miał w ciągu dnia różne zadania"},
  {"wymiar": "RYZ", "tekstA": "żebym mógł podejmować ryzyko i próbować nowych rzeczy", "tekstB": "żebym miał poczucie bezpieczeństwa i stały dochód"},
  {"wymiar": "DEC", "tekstA": "żebym sam decydował, jak wykonać swoją pracę", "tekstB": "żeby ktoś inny brał decyzje na siebie"},
  {"wymiar": "KON", "tekstA": "żebym mógł mówić wprost, co myślę", "tekstB": "żeby atmosfera wokół mnie była spokojna"},
  {"wymiar": "NOW", "tekstA": "żeby ciągle działo się coś nowego", "tekstB": "żebym mógł opanować swoją pracę do perfekcji"},
  {"wymiar": "NAP", "tekstA": "żeby nikt nie stał nade mną i mnie nie kontrolował", "tekstB": "żeby ktoś pilnował terminów za mnie"},
  {"wymiar": "RYT", "tekstA": "żebym mógł pracować równym tempem każdego dnia", "tekstB": "żebym mógł pracować zrywami, kiedy mam energię"},
  {"wymiar": "OTO", "tekstA": "żeby wokół mnie było cicho i spokojnie", "tekstB": "żeby wokół mnie ciągle coś się działo"},
  {"wymiar": "EFE", "tekstA": "żebym widział efekt tego, co robię, na bieżąco", "tekstB": "żebym mógł pracować nad czymś, czego efekt przyjdzie później"},
];

export const INSTRUKCJA_A3 = {
  naglowek: "Jak naturalnie działam",
  wprowadzenie: [
    "Teraz nie o tym, co lubisz, tylko o tym, jak się zachowujesz.",
    "Zobaczysz pary stwierdzeń. Wybieraj to, co jest bliżej prawdy o Tobie dzisiaj, a nie tego, jak chciałbyś się zachowywać.",
    "Nie ma tu lepszego bieguna. Obie strony są równoprawne.",
  ],
  polecenieBloku: "Co jest bliżej prawdy o Tobie?",
  kotwiceNaglowek: "Jak bardzo Ci na tym zależy?",
  kotwicePrefiks: "Zależy mi na tym,",
  kotwiceSkala: ["wcale", "", "", "", "bardzo"],
} as const;
