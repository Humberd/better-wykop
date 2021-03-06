[![Build Status](https://dev.azure.com/humberd/Wykop-plus-plus/_apis/build/status/Wykop-plus-plus-CI?branchName=master)](https://dev.azure.com/humberd/Wykop-plus-plus/_build/latest?definitionId=1?branchName=master)
[![Deploy Status](https://vsrm.dev.azure.com/humberd/_apis/public/Release/badge/c81245c5-8aba-4588-a566-a3d5dc3703c2/2/2)](https://vsrm.dev.azure.com/humberd/_apis/public/Release/badge/c81245c5-8aba-4588-a566-a3d5dc3703c2/2/2)

# Wykop++

Rozszerzenie zapewniające dodatkowe funkcjonalności dla portalu [Wykop.pl](https://wykop.pl).


### Dostępne na:

[<img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Google_Chrome_icon_%282011%29.svg" alt="Chrome Store" width="64">](https://chrome.google.com/webstore/detail/wykop%20%20/fdoonokgdbeahghjlmlfbbdopggbacio)
[<img src="https://upload.wikimedia.org/wikipedia/commons/6/67/Firefox_Logo%2C_2017.svg" alt="Firefox Addo-ons" width="64">](https://addons.mozilla.org/pl/firefox/addon/wykop-plus-plus/)


### Funkcjonalności:
 * Umożliwia chowanie komentarzy - stan jest zapamiętywany.
 * Wyświetla liczbę komentarzy per rodzic.
 * Nieskończony scroll.
 * Usuwa stopke.
 * Oznaczenie przeczytanych komentarzy _(TODO)_.
 * Czas życia zapisanego stanu chowanych komentarzy _(TODO)_.

## Wymagania:

 * node 10.8.0 (inne wersje nie były testowane)

## Instalacja:

```sh
npm ci
```

## Budowanie:

```sh
npm run build-prod
```

### Screeny:

#### Chowanie komentarzy:

![](images/.README_images/chowanie-komentarzy.png)


#### Nieskończony scroll:

![](images/.README_images/infinite-scroll.png)

## Issues and contributions:

Jeśli dostrzegłeś jakiś problem utwórz Issue, lub zrób Pull Request.
