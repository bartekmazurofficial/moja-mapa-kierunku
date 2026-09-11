# -*- coding: utf-8 -*-
"""Przywrocenie polskich znakow w tekstach wyswietlanych uczestnikowi."""

M = {}
def m(s):
    for para in s.split(";"):
        para = para.strip()
        if not para: continue
        a, b = para.split("=")
        M[a.strip()] = b.strip()

# rzeczowniki i nazwy
m("""tresci=treści; tresc=treść; czesc=część; czesci=części; wiekszosc=większość;
wiekszosci=większości; calosc=całość; calosci=całości; jakosc=jakość; jakosci=jakości;
mozliwosc=możliwość; mozliwosci=możliwości; umiejetnosci=umiejętności; umiejetnosc=umiejętność;
wartosci=wartości; wartosc=wartość; dzialalnosc=działalność; dzialalnosci=działalności;
odpowiedzialnosc=odpowiedzialność; odpowiedzialnosci=odpowiedzialności; samodzielnosc=samodzielność;
niepelnosprawnoscia=niepełnosprawnością; wlasciwosci=właściwości; zdolnosc=zdolność;
plynnosc=płynność; przyszlosc=przyszłość; przyszlosci=przyszłości; rzeczywistosc=rzeczywistość;
trudnosc=trudność; trudnosci=trudności; wiarygodnosc=wiarygodność; dostepnosc=dostępność;
rentownosc=rentowność; rentownosci=rentowności; skutecznosc=skuteczność; pewnosc=pewność;
gotowosc=gotowość; sprawnosc=sprawność; wytrzymalosc=wytrzymałość; dokladnosc=dokładność;
uprzejmosc=uprzejmość; cierpliwosc=cierpliwość; opiekunczosc=opiekuńczość; odpornosc=odporność;
konkurencyjnosc=konkurencyjność; stabilnosc=stabilność; zgodnosc=zgodność; wolnosc=wolność""")

m("""ksiegowy=księgowy; ksiegowa=księgowa; ksiegowosc=księgowość; ksiegowosci=księgowości;
slusarz=ślusarz; zywnosci=żywności; zywnosc=żywność; zywienie=żywienie; zywienia=żywienia;
srodowiska=środowiska; srodowisko=środowisko; srodowiskowe=środowiskowe; srodowiskowa=środowiskowa;
srodki=środki; srodkow=środków; srodek=środek; zrodla=źródła; zrodlo=źródło; zrodel=źródeł;
lesnictwo=leśnictwo; lesnik=leśnik; zolnierz=żołnierz; wiezienna=więzienna; wieziennej=więziennej;
polozna=położna; poloznictwo=położnictwo; pielegniarka=pielęgniarka; pielegniarstwo=pielęgniarstwo;
pielegniarskie=pielęgniarskie; pielegnacyjne=pielęgnacyjne; pielegnacja=pielęgnacja;
przedsiebiorczosc=przedsiębiorczość; przedsiebiorstw=przedsiębiorstw; slowo=słowo;
lancuchy=łańcuchy; lancucha=łańcucha; wlasna=własna; wlasnej=własnej; wlasny=własny;
wlasnych=własnych; wlasne=własne; wlasciciel=właściciel; wlasciwa=właściwa;
swiat=świat; swiata=świata; swiecki=świecki; swiat=świat; swiete=Święte; swietej=świętej;
poczatkowego=początkowego; poczatku=początku; poczatek=początek; miedzynarodowe=międzynarodowe;
miedzynarodowych=międzynarodowych; miedzynarodowy=międzynarodowy; bezpieczenstwo=bezpieczeństwo;
bezpieczenstwa=bezpieczeństwa; wewnetrzne=wewnętrzne; wewnetrzny=wewnętrzny; wewnetrznej=wewnętrznej;
panstwowych=Państwowych; panstwowe=państwowe; przedszkolna=przedszkolna; wczesnoszkolna=wczesnoszkolna;
zarzadzanie=zarządzanie; zarzadzania=zarządzania; zarzadzanii=zarządzaniu; zarzadzaniu=zarządzaniu;
urzadzen=urządzeń; urzadzenia=urządzenia; urzadzeniami=urządzeniami; narzedzi=narzędzi;
narzedzia=narzędzia; narzedziem=narzędziem; naped=napęd; napedy=napędy; wiedzy=wiedzy;
ksiazka=książka; psychologia=psychologia; wzornictwo=wzornictwo; rezyseria=reżyseria;
rezysera=reżysera; wnetrz=wnętrz; wnetrza=wnętrza; przestrzenna=przestrzenna;
dzwieku=dźwięku; dzwiek=dźwięk; dzwiekowa=dźwiękowa; zwiazkowe=związkowe; zwiazane=związane;
zwiazanym=związanym; zwiazku=związku; poswiadcza=poświadcza""")

# czasowniki i formy
m("""odpowiadac=odpowiadać; pracowac=pracować; zarabiac=zarabiać; uczyc=uczyć; robic=robić;
byc=być; miec=mieć; zrobic=zrobić; wejsc=wejść; dojsc=dojść; przejsc=przejść; wybrac=wybrać;
zdobyc=zdobyć; zaczac=zacząć; skonczyc=skończyć; prowadzic=prowadzić; decydowac=decydować;
zarzadzac=zarządzać; sprzedawac=sprzedawać; leczyc=leczyć; badac=badać; liczyc=liczyć;
projektowac=projektować; naprawiac=naprawiać; budowac=budować; gotowac=gotować;
opiekowac=opiekować; wspierac=wspierać; tlumaczyc=tłumaczyć; pilnowac=pilnować;
sprawdzic=sprawdzić; sprawdzac=sprawdzać; ustalic=ustalić; przekonac=przekonać;
odmowic=odmówić; zaplacic=zapłacić; utrzymac=utrzymać; utrzymuje=utrzymuje;
wykonywac=wykonywać; wykonywania=wykonywania; wymagac=wymagać; wymaga=wymaga;
wymagaja=wymagają; wymagane=wymagane; wymaganych=wymaganych; oznacza=oznacza;
znaczy=znaczy; rozniaja=różnią; rozni=różni; roznica=różnica; roznice=różnice;
roznicy=różnicy; rozne=różne; rozna=różna; roznych=różnych; rozny=różny;
zadziala=zadziała; dziala=działa; dzialania=działania; dzialaja=działają;
zostaje=zostaje; zostac=zostać; pozostaje=pozostaje; sprawia=sprawia;
przynosi=przynosi; daje=daje; dajaca=dająca; prowadzi=prowadzi; prowadzaca=prowadząca;
wchodzi=wchodzi; wchodza=wchodzą; konczy=kończy; zaczyna=zaczyna; trwa=trwa;
placi=płaci; placa=płaca; platny=płatny; platna=płatna; platne=płatne; platnych=płatnych;
placi=płaci; oplacalnosc=opłacalność; oplaty=opłaty; bezplatna=bezpłatna;
bezplatny=bezpłatny; bezplatne=bezpłatne; bezplatnie=bezpłatnie; przyjmuja=przyjmują;
znajdzie=znajdzie; szuka=szuka; szukania=szukania; podejmuje=podejmuje;
podjac=podjąć; nalezy=należy; naleza=należą; dotyczy=dotyczy; dotycza=dotyczą;
uczy=uczy; ucza=uczą; potrafi=potrafi; moze=może; moga=mogą; musi=musi; musza=muszą;
chce=chce; chca=chcą; chcesz=chcesz; wolisz=wolisz; masz=masz; jestes=jesteś;
bedzie=będzie; beda=będą; bedziesz=będziesz; wytrzymasz=wytrzymasz; zniesiesz=zniesiesz;
poradzisz=poradzisz; wyjdziesz=wyjdziesz; przezyjesz=przeżyjesz; zaplaci=zapłaci""")

# przymiotniki, przyslowki, spojniki
m("""wiecej=więcej; mniej=mniej; najwiecej=najwięcej; wiekszy=większy; wieksza=większa;
wieksze=większe; wiekszym=większym; wiekszej=większej; najwiekszy=największy;
najwieksza=największa; najwieksze=największe; mniejszy=mniejszy; mniejsza=mniejsza;
mniejsze=mniejsze; mniejszych=mniejszych; dluzej=dłużej; dlugi=długi; dluga=długa;
dlugie=długie; dlugich=długich; dlugiej=długiej; krotszy=krótszy; krotsza=krótsza;
krotka=krótka; krotki=krótki; krotko=krótko; ciezki=ciężki; ciezka=ciężka;
ciezkie=ciężkie; ciezko=ciężko; latwo=łatwo; latwy=łatwy; latwa=łatwa; latwe=łatwe;
latwiej=łatwiej; trudny=trudny; trudna=trudna; trudne=trudne; trudno=trudno;
dobry=dobry; dobra=dobra; dobre=dobre; dobrze=dobrze; zly=zły; zla=zła; zle=źle;
wysoki=wysoki; wysoka=wysoka; wysokie=wysokie; wysokich=wysokich; niski=niski;
niska=niska; niskie=niskie; niskich=niskich; szeroki=szeroki; szeroka=szeroka;
waski=wąski; waska=wąska; waskie=wąskie; pelny=pełny; pelna=pełna; pelne=pełne;
pelnej=pełnej; pelnym=pełnym; czesty=częsty; czesta=częsta; czeste=częste;
czesto=często; czesciej=częściej; rzadki=rzadki; rzadko=rzadko; wazny=ważny;
wazna=ważna; wazne=ważne; wazniejsze=ważniejsze; wazniejszy=ważniejszy;
najwazniejsze=najważniejsze; najwazniejsza=najważniejsza; niezbedny=niezbędny;
potrzebny=potrzebny; potrzebna=potrzebna; potrzebne=potrzebne; realny=realny;
realna=realna; realne=realne; realnie=realnie; konkretny=konkretny; konkretna=konkretna;
konkretne=konkretne; konkretnych=konkretnych; jednoznacznie=jednoznacznie;
samodzielny=samodzielny; samodzielna=samodzielna; samodzielne=samodzielne;
samodzielnie=samodzielnie; zawodowy=zawodowy; zawodowa=zawodowa; zawodowe=zawodowe;
zawodowych=zawodowych; zawodowej=zawodowej; spoleczna=społeczna; spoleczne=społeczne;
spolecznej=społecznej; spolecznych=społecznych; publicznej=publicznej; publiczna=publiczna;
panstwowa=państwowa; medyczny=medyczny; medyczna=medyczna; medyczne=medyczne;
techniczny=techniczny; techniczna=techniczna; techniczne=techniczne; technicznych=technicznych;
artystyczny=artystyczny; artystyczna=artystyczna; artystyczne=artystyczne;
uniwersytecki=uniwersytecki; praktyczny=praktyczny; praktyczna=praktyczna;
praktyczne=praktyczne; praktycznych=praktycznych; branzowa=branżowa; branzowe=branżowe;
branzowy=branżowy; policealna=policealna; podyplomowe=podyplomowe; jednolite=jednolite;
srednia=średnia; sredni=średni; srednie=średnie; przecietny=przeciętny;
przecietna=przeciętna; przecietnych=przeciętnych; poczatkujacy=początkujący;
doswiadczony=doświadczony; doswiadczenie=doświadczenie; doswiadczenia=doświadczenia;
doswiadczeniem=doświadczeniem; bezposrednie=bezpośrednie; bezposredni=bezpośredni;
bezposrednio=bezpośrednio; posrednie=pośrednie; pozniej=później; wczesniej=wcześniej;
wczesnie=wcześnie; dzisiaj=dzisiaj; obecnie=obecnie; zwykle=zwykle; czasem=czasem;
zawsze=zawsze; nigdy=nigdy; jeszcze=jeszcze; juz=już; tez=też; takze=także;
rowniez=również; jedynie=jedynie; wylacznie=wyłącznie; przede=przede; wszystkim=wszystkim;
wszystkie=wszystkie; wszystkich=wszystkich; kazdy=każdy; kazda=każda; kazde=każde;
kazdym=każdym; kazdej=każdej; zaden=żaden; zadna=żadna; zadne=żadne; zadnych=żadnych;
kilka=kilka; kilku=kilku; kilkunastu=kilkunastu; kilkudziesieciu=kilkudziesięciu;
wiele=wiele; wielu=wielu; niewiele=niewiele; troche=trochę; bardzo=bardzo;
raczej=raczej; wcale=wcale; nawet=nawet; wrecz=wręcz; jesli=jeśli; gdyby=gdyby;
zeby=żeby; poniewaz=ponieważ; dlatego=dlatego; mimo=mimo; oprocz=oprócz;
wobec=wobec; wedlug=według; miedzy=między; przez=przez; dla=dla; przy=przy;
bez=bez; nad=nad; pod=pod; ponad=ponad; okolo=około; wzgledem=względem""")

# specyficzne dla domeny
m("""rekrutacji=rekrutacji; rekrutacja=rekrutacja; egzamin=egzamin; egzaminu=egzaminu;
egzaminy=egzaminy; matura=matura; maturze=maturze; matury=matury; maturalnym=maturalnym;
maturalne=maturalne; szkola=szkoła; szkoly=szkoły; szkole=szkole; szkolnej=szkolnej;
studia=studia; studiow=studiów; studiach=studiach; studiowac=studiować; uczelni=uczelni;
uczelnia=uczelnia; dyplom=dyplom; dyplomu=dyplomu; uprawnien=uprawnień; uprawnienia=uprawnienia;
uprawnieniami=uprawnieniami; kwalifikacji=kwalifikacji; kwalifikacje=kwalifikacje;
specjalizacja=specjalizacja; specjalizacje=specjalizacje; specjalizacji=specjalizacji;
praktyki=praktyki; praktyka=praktyka; praktyce=praktyce; staz=staż; stazu=stażu;
aplikacje=aplikację; aplikacja=aplikacja; aplikacji=aplikacji; rezydentura=rezydentura;
kurs=kurs; kursy=kursy; kursow=kursów; kursie=kursie; nauka=nauka; nauki=nauki;
nauke=naukę; naucza=naucza; nauczanie=nauczanie; nauczania=nauczania; nauczyciel=nauczyciel;
nauczycieli=nauczycieli; zawod=zawód; zawodu=zawodu; zawody=zawody; zawodach=zawodach;
zawodem=zawodem; zawodow=zawodów; praca=praca; pracy=pracy; prace=prace; praca=praca;
pracownik=pracownik; pracownicy=pracownicy; pracodawca=pracodawca; pracodawce=pracodawcę;
klient=klient; klienta=klienta; klienci=klienci; klientow=klientów; klientami=klientami;
pacjent=pacjent; pacjenta=pacjenta; pacjentow=pacjentów; uczestnik=uczestnik;
uczestnika=uczestnika; zespol=zespół; zespolu=zespołu; zespolem=zespołem;
firma=firma; firmy=firmy; firme=firmę; firmie=firmie; przedsiebiorstwo=przedsiębiorstwo;
warsztat=warsztat; warsztatu=warsztatu; zaklad=zakład; zakladu=zakładu; lokal=lokal;
lokalu=lokalu; gabinet=gabinet; gabinetu=gabinetu; salon=salon; magazyn=magazyn;
budowa=budowa; budowie=budowie; budowlana=budowlana; budowlane=budowlane;
budownictwo=budownictwo; instalacje=instalacje; instalacji=instalacji; montaz=montaż;
montazu=montażu; naprawa=naprawa; naprawy=naprawy; diagnoza=diagnoza; diagnostyka=diagnostyka;
diagnostyki=diagnostyki; terapia=terapia; terapie=terapię; terapii=terapii;
opieka=opieka; opieki=opieki; opieke=opiekę; zdrowie=zdrowie; zdrowia=zdrowia;
zdrowotne=zdrowotne; choroba=choroba; chorob=chorób; smierc=śmierć; smiercia=śmiercią;
smierci=śmierci; ryzyko=ryzyko; ryzyka=ryzyka; zagrozenie=zagrożenie; zagrozony=zagrożony;
zagrozona=zagrożona; zagrozone=zagrożone; bezpieczny=bezpieczny; bezpieczna=bezpieczna;
bezpieczne=bezpieczne; obciazenie=obciążenie; obciazajacych=obciążających;
obciazajaca=obciążająca; wypalenie=wypalenie; wypalenia=wypalenia; stres=stres;
presja=presja; presji=presji; konflikt=konflikt; konfliktu=konfliktu; rozmowa=rozmowa;
rozmowy=rozmowy; rozmowe=rozmowę; wywiad=wywiad; negocjacje=negocjacje;
sprzedaz=sprzedaż; sprzedazy=sprzedaży; marketingu=marketingu; finanse=finanse;
finansow=finansów; finansowe=finansowe; finansowa=finansowa; pieniadze=pieniądze;
pieniedzy=pieniędzy; zarobki=zarobki; dochod=dochód; dochodu=dochodu; wynagrodzenie=wynagrodzenie;
wynagrodzen=wynagrodzeń; koszty=koszty; kosztow=kosztów; koszt=koszt; budzet=budżet;
budzetu=budżetu; podatki=podatki; podatkowe=podatkowe; podatkowy=podatkowy;
rachunkowosc=rachunkowość; rachunkowosci=rachunkowości; przepisy=przepisy; przepisow=przepisów;
prawo=prawo; prawa=prawa; prawne=prawne; prawny=prawny; sad=sąd; sadowy=sądowy;
sadowych=sądowych; urzad=urząd; urzedu=urzędu; urzednik=urzędnik; administracja=administracja;
dokumentacja=dokumentacja; dokumentacji=dokumentacji; sprawozdania=sprawozdania;
raport=raport; raportu=raportu; analiza=analiza; analizy=analizy; analize=analizę;
dane=dane; danych=danych; system=system; systemu=systemu; systemy=systemy;
technologia=technologia; technologii=technologii; program=program; programu=programu;
projekt=projekt; projektu=projektu; projektowanie=projektowanie; projektowania=projektowania;
produkcja=produkcja; produkcji=produkcji; produkt=produkt; produktu=produktu;
transport=transport; transportu=transportu; logistyka=logistyka; logistyki=logistyki;
magazynowanie=magazynowanie; rolnictwo=rolnictwo; ogrodnictwo=ogrodnictwo;
weterynaria=weterynaria; farmacja=farmacja; fizjoterapia=fizjoterapia; dietetyka=dietetyka;
kosmetologia=kosmetologia; grafika=grafika; fotografia=fotografia; montazysta=montażysta;
dziennikarstwo=dziennikarstwo; muzyka=muzyka; aktorstwo=aktorstwo; pedagogika=pedagogika;
socjologia=socjologia; filologia=filologia; teologia=teologia; politologia=politologia;
kryminologia=kryminologia; geodezja=geodezja; kartografia=kartografia; biotechnologia=biotechnologia;
chemia=chemia; fizyka=fizyka; matematyka=matematyka; matematyki=matematyki;
informatyka=informatyka; informatyki=informatyki; ekonomia=ekonomia; ekonomii=ekonomii;
ekonometria=ekonometria; statystyka=statystyka; automatyka=automatyka; robotyka=robotyka;
mechanika=mechanika; elektrotechnika=elektrotechnika; mechatronika=mechatronika;
energetyka=energetyka; telekomunikacja=telekomunikacja; cyberbezpieczenstwo=cyberbezpieczeństwo;
gastronomia=gastronomia; gastronomii=gastronomii; hotelarstwo=hotelarstwo;
kucharz=kucharz; cukiernik=cukiernik; kelner=kelner; barista=barista; fryzjer=fryzjer;
stolarz=stolarz; krawiec=krawiec; spawacz=spawacz; elektryk=elektryk; hydraulik=hydraulik;
mechanik=mechanik; kierowca=kierowca; spedytor=spedytor; ogrodnik=ogrodnik;
psycholog=psycholog; psychoterapeuta=psychoterapeuta; lekarz=lekarz; farmaceuta=farmaceuta;
weterynarz=weterynarz; architekt=architekt; inzynier=inżynier; inzynieria=inżynieria;
inzynierii=inżynierii; programista=programista; tester=tester; administrator=administrator;
rekruter=rekruter; policjant=policjant; strazak=strażak; ratownik=ratownik;
kurator=kurator; notariusz=notariusz; katecheta=katecheta; duszpasterz=duszpasterz;
misjonarz=misjonarz; animator=animator; fundraiser=fundraiser; coach=coach; lektor=lektor;
trener=trener; instruktor=instruktor; opiekun=opiekun; opiekunka=opiekunka;
asystent=asystent; technik=technik; operator=operator; monter=monter; diagnosta=diagnosta;
protetyk=protetyk; optyk=optyk; masazysta=masażysta; dietetyk=dietetyk; agronom=agronom;
geodeta=geodeta; kosztorysant=kosztorysant; dyspozytor=dyspozytor; recepcjonista=recepcjonista;
menedzer=menedżer; szef=szef; kierownik=kierownik; wlasciciel=właściciel;
franczyzobiorca=franczyzobiorca; zalozyciel=założyciel; handlowiec=handlowiec;
przedstawiciel=przedstawiciel; doradca=doradca; konsultant=konsultant; analityk=analityk;
kontroler=kontroler; audytor=audytor; redaktor=redaktor; copywriter=copywriter;
ilustrator=ilustrator; projektant=projektant; producent=producent; aktor=aktor;
muzyk=muzyk; realizator=realizator; pedagog=pedagog; wychowanie=wychowanie;
fizyczne=fizyczne; specjalny=specjalny; specjalna=specjalna; specjalnej=specjalnej;
przedszkole=przedszkole; zlobek=żłobek; zlobku=żłobku; dzieci=dzieci; dziecko=dziecko;
dziecka=dziecka; mlodziez=młodzież; mlodziezy=młodzieży; mlodych=młodych;
seniorow=seniorów; starszej=starszej; rodzina=rodzina; rodziny=rodziny; rodzinie=rodzinie;
kryzysie=kryzysie; kryzys=kryzys; wsparcie=wsparcie; wsparcia=wsparcia; pomoc=pomoc;
pomocy=pomocy; socjalna=socjalna; socjalnej=socjalnej; wspolnota=wspólnota;
wspolnoty=wspólnoty; koscioła=kościoła; kosciola=kościoła; parafii=parafii""")

if __name__ == "__main__":
    print(f"odwzorowan w slowniku: {len(M)}")

# --- uzupelnienie drugie ---
m("""biezaco=bieżąco; blad=błąd; blizej=bliżej; branzowosc=branżowość; budzetem=budżetem;
budzetowanie=budżetowanie; celowac=celować; ciazy=ciąży; cieplna=cieplna; cieplo=ciepło;
czescia=częścią; czesciowo=częściowo; czestsza=częstsza; czlonkostwo=członkostwo;
czlowieka=człowieka; czyichs=czyichś; czynnosci=czynności; doprowadzic=doprowadzić;
doswiadczeniu=doświadczeniu; doswiadczonego=doświadczonego; drozszego=droższego;
drozszej=droższej; dzialala=działała; dzialow=działów; dziecmi=dziećmi; dzien=dzień;
dzis=dziś; dzwoniacy=dzwoniący; efektywnosc=efektywność; formalnosci=formalności;
gleboznawstwo=gleboznawstwo; glosu=głosu; glowna=główna; glownego=głównego; glowny=główny;
hurtownie=hurtownie; ilosciowe=ilościowe; jednoczesnie=jednocześnie; jezdzi=jeździ;
jezykoznawstwo=językoznawstwo; kilkadziesiat=kilkadziesiąt; kilkanascie=kilkanaście;
klase=klasę; konsolecie=konsolecie; korzystaja=korzystają; kosztorysowania=kosztorysowania;
kosztowal=kosztował; ksiegowego=księgowego; ktorzy=którzy; kuchnie=kuchnię; kurzu=kurzu;
laczy=łączy; ludzmi=ludźmi; marzy=marży; mozliwoscia=możliwością; mozna=można;
mowic=mówić; mysl=myśl; naborze=naborze; nadawac=nadawać; naglosnieniu=nagłośnieniu;
najciezszym=najcięższym; najczesciej=najczęściej; najczestsza=najczęstsza;
najkrotsza=najkrótsza; najlatwiejsze=najłatwiejsze; najnizszy=najniższy;
najszybciej=najszybciej; najtansza=najtańsza; najtansze=najtańsze; najwyzszych=najwyższych;
negocjowac=negocjować; nieniszczace=nieniszczące; nieprzewidywalne=nieprzewidywalne;
nieruchomosci=nieruchomości; nieufnosc=nieufność; nizsze=niższe; nizszy=niższy;
obciazajace=obciążające; obciazajacy=obciążający; obsluga=obsługa; obsluge=obsługę;
obsluguje=obsługuje; oceniac=oceniać; odejscia=odejścia; odpornosci=odporności;
ogarniac=ogarniać; ogrzewanie=ogrzewanie; opanowac=opanować; opiekunczym=opiekuńczym;
oplaci=opłaci; osciez=oścież; osobiscie=osobiście; ostrzejsza=ostrzejsza;
oznaczaja=oznaczają; pamieciowego=pamięciowego; patrzec=patrzeć; piec=pięć;
placowce=placówce; placowkami=placówkami; platnego=płatnego; polaczenie=połączenie;
poloznej=położnej; postepowanie=postępowanie; pozarzadowego=pozarządowego;
prawdopodobienstwa=prawdopodobieństwa; przestepczosci=przestępczości;
przemyslowe=przemysłowe; przemyslowy=przemysłowy; przeniesienia=przeniesienia;
przeprowadzki=przeprowadzki; przeklad=przekład; przekraczanie=przekraczanie;
przewoznika=przewoźnika; przewoznikow=przewoźników; przewidujace=przewidujące;
przod=przód; przychodza=przychodzą; przyjezdza=przyjeżdża; przyswajania=przyswajania;
regularnosc=regularność; roslin=roślin; roslinna=roślinna; rosnacym=rosnącym;
rozmawiac=rozmawiać; rzemioslo=rzemiosło; sciezek=ścieżek; sciezki=ścieżki;
scislych=ścisłych; sie=się; skorze=skórze; sluzb=służb; sluzbie=służbie;
sluzbowego=służbowego; sluzby=służby; spedza=spędza; spoleczenstwie=społeczeństwie;
sprawnosci=sprawności; sprawnosciowe=sprawnościowe; sprawozdawczosc=sprawozdawczość;
sprzedazowa=sprzedażowa; sprzedazowego=sprzedażowego; sprzet=sprzęt; sprzetu=sprzętu;
sredniej=średniej; suficie=suficie; swiadczenia=świadczenia; swiadczeniach=świadczeniach;
swiatlo=światło; szkolen=szkoleń; szkolkarstwo=szkółkarstwo; tansze=tańsze; tanszy=tańszy;
tworcze=twórcze; tysiecy=tysięcy; urzadzanie=urządzanie; uslug=usług; usluge=usługę;
uslugowa=usługowa; utrzymywac=utrzymywać; utrzymywanej=utrzymywanej; uzasadniac=uzasadniać;
uzytkowanie=użytkowanie; warsztatow=warsztatów; wczesniejszego=wcześniejszego;
wdrozenia=wdrożenia; wdrozeniowe=wdrożeniowe; wejscia=wejścia; wejscie=wejście;
wejsciowy=wejściowy; wewnatrz=wewnątrz; wewnetrzna=wewnętrzna; wiec=więc; wiedz=wiedz;
wladze=władzę; wlasnym=własnym; wlasnymi=własnymi; wlosy=włosy; wskazniki=wskaźniki;
wykonczeniowe=wykończeniowe; wyplaty=wypłaty; wyrownawczy=wyrównawczy;
wysokosci=wysokości; wytwarzania=wytwarzania; wyzszy=wyższy; wyzszym=wyższym;
zagranicznymi=zagranicznymi; zagrozonych=zagrożonych; zakladzie=zakładzie;
zakonczony=zakończony; zalezy=zależy; zamiennikiem=zamiennikiem; zamknietej=zamkniętej;
zarzadza=zarządza; zarzadzaniem=zarządzaniem; zgodnosci=zgodności; zlecen=zleceń;
zlosliwego=złośliwego; zlotych=złotych; zmeczeni=zmęczeni; zmieniajacych=zmieniających;
znacza=znaczą; znajomosc=znajomość; znajomosci=znajomości; zwiazana=związana;
zwierzat=zwierząt; zwierzeca=zwierzęca; zwykla=zwykła; wystarcza=wystarcza;
wyglada=wygląda; opinie=opinie; obraz=obraz; obrazu=obrazu; obrazowanie=obrazowanie;
pielegniarska=pielęgniarska; szerszy=szerszy; przewaga=przewaga; przewagi=przewagi;
przetrwaniu=przetrwaniu; przesycony=przesycony; przyczyna=przyczyną; przyczyny=przyczyny;
sceniczny=sceniczny; sektorze=sektorze; samotnie=samotnie; samodzielnej=samodzielnej;
rozliczany=rozliczany; rozliczenia=rozliczenia; rozliczenie=rozliczenie""")

m("""miesiaca=miesiąca; miesiace=miesiące; mlody=młody; plac=płac; problemow=problemów;
specjalnosci=specjalności; wydarzen=wydarzeń; douczenia=douczenia; sze=sze""")

# --- uzupelnienie trzecie, pelne domkniecie ---
m("""absolwentow=absolwentów; administracje=administrację; analityke=analitykę; badan=badań;
bezposrednia=bezpośrednia; bezposredniej=bezpośredniej; biur=biur; branza=branża;
branzowej=branżowej; cala=cała; calego=całego; calej=całej; caly=cały; certyfikatow=certyfikatów;
cialem=ciałem; cos=coś; daja=dają; dostepna=dostępna; dostepu=dostępu; duza=duża; duzego=dużego;
duzo=dużo; dyzury=dyżury; kandydatow=kandydatów; kariere=karierę; ksiag=ksiąg; ktora=która;
ktore=które; ktorego=którego; ktorej=której; ktory=który; ktorych=których; ktorym=którym;
ktos=ktoś; laboratoriow=laboratoriów; latwej=łatwej; lekarza=lekarza; majatkowych=majątkowych;
malo=mało; malutko=malutko; material=materiał; materialem=materiałem; materialow=materiałów;
materialowa=materiałowa; materialowe=materiałowe; materialy=materiały; matke=matkę;
miesiacach=miesiącach; miesiecy=miesięcy; nia=nią; niz=niż; ogolna=ogólna; odejsc=odejść;
oddzial=oddział; oddzialow=oddziałów; osob=osób; osobe=osobę; pensje=pensję; piaty=piąty;
podstawe=podstawę; pojazdow=pojazdów; polsce=Polsce; polska=Polska; porod=poród;
porodu=porodu; postepowania=postępowania; postepy=postępy; powyzej=powyżej; pracowal=pracował;
praktyke=praktykę; presje=presję; prog=próg; produkcje=produkcję; programistow=programistów;
projektow=projektów; prowadza=prowadzą; przedmiotow=przedmiotów; rece=ręce; reki=ręki;
rol=ról; rozmow=rozmów; sa=są; sila=siła; sily=siły; skora=skóra; sporow=sporów;
sposob=sposób; srodku=środku; stala=stała; stawke=stawkę; trojki=trójki; uzna=uzna;
uzytkowego=użytkowego; uzytkownikow=użytkowników; uzytkowych=użytkowych; uzywa=używa;
wode=wodę; wodociagi=wodociągi; wsrod=wśród; wstepna=wstępna; wstepnego=wstępnego;
wstepny=wstępny; wstepnych=wstępnych; wybor=wybór; wyborem=wyborem; wymagan=wymagań;
wymogow=wymogów; wysilku=wysiłku; zarobkow=zarobków; zastapi=zastąpi; zatrudniaja=zatrudniają;
zdjecia=zdjęcia; zuzywaja=zużywają; zycia=życia; trafiaja=trafiają; wydaja=wydają;
zdobytego=zdobytego; awariach=awariach; oferty=oferty; opisowa=opisowa; opozycji=opozycji;
kanalizacja=kanalizacja; kancelarie=kancelarię; germanska=germańska; obrobka=obróbka""")

m("""nabor=nabór; nabory=nabory""")
KONTEKST = [("Praca z rodzina","Praca z rodziną"), ("o prace ","o pracę "),
            ("z nia ","z nią "), ("na nia ","na nią "),
            ("za jedna osobę","za jedną osobę"), ("jedna osobe","jedną osobę"),
            ("i związana z nią","i związaną z nią"), ("ma władzę i związana","ma władzę i związaną")]

m("""specjalistow=specjalistów; pisza=piszą""")
