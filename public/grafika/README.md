# Tu wrzucasz grafiki

Spis tego, co jest potrzebne, z rozmiarami i tłem: `GRAFIKI.md` w katalogu
głównym projektu.

Nazwy plików bez polskich znaków i spacji. Po wrzuceniu daj znać — podmienię
rysowane wektorem bramy na render i podepnę tła nagłówków.

## Co już jest

`a1/` — dwadzieścia cztery ilustracje obszarów zainteresowań, po dwie wersje:
`<numer>.jpg` (256 px, kafel) i `<numer>-duzy.jpg` (768 px, nagłówek).
Oryginały 1254 px zostają poza repozytorium, bo ważą po 2 MB.

Nowa partia: `npx tsx scripts/grafiki.ts <katalog ze źródłami> <moduł>`,
potem dopisanie modułu do `Z_OBRAZEM` w `lib/ui/obrazy.ts`.
