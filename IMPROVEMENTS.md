# Améliorations futures

## 1. Bouton reset sur les selects

Pouvoir vider chaque select (année, genre, style) pour revenir à « aucun filtre »,
sans recharger la page.

- `react-select` le gère nativement via la prop `isClearable` (petite croix dans le
  champ) — à passer dans `SelectComponent` (`src/component/selectComponent.tsx`).
  Les `onChange` d'`albumFinder.tsx` gèrent déjà `option === null` (`option?.value ?? ""`).
- Option bonus : un bouton « Reset » global qui remet `genre`, `year` et `style` à `""`.
- Penser à styliser la croix (`clearIndicator` dans le `styles` prop) avec les
  variables `var(--win95-*)`, comme le reste du thème.

## 2. Toggle années une à une / par tranches de 5 ou 10 ans

Un toggle (checkbox ou boutons radio style Win95) au-dessus du select d'années qui
remplace la liste `1950…2026` par des tranches : `2020–2026`, `2010–2019`… (10 ans)
ou `2020–2024`, `2015–2019`… (5 ans).

- Générer les options dans `src/component/select.tsx` à côté de `yearOptions`
  (ex. `yearRangeOptions(step: 5 | 10)`), avec une `value` du type `"1990-1999"`.
- Côté API : vérifier si le paramètre `year` de `/database/search` de Discogs accepte
  une plage. Sinon, tirer une année au hasard dans la tranche avant d'appeler
  `getOneRandomAlbum` (et l'afficher dans le message « No album available… »).
- Quand on change de mode, réinitialiser `year` pendant le render (pattern
  `prevX` déjà utilisé dans `App.tsx`), pas dans un `useEffect`.
- Adapter le texte du bouton (`from 1990` → `from the 90s` / `from 1990–1999`).

## 3. Choix des selects dans le titre de l'onglet

Mettre à jour dynamiquement le titre de l'onglet du navigateur selon les filtres,
ex. `Jazz · Bebop · 1959 — Discogs Roulette 🪩`, et revenir à
`Discogs Roulette 🪩` (titre de `index.html`) quand rien n'est sélectionné.

- Ici un `useEffect` qui écrit `document.title` est légitime (synchronisation avec
  un système externe, pas un `setState`), donc pas de souci avec la règle
  `react-hooks/set-state-in-effect`.
- React 19 permet aussi de rendre directement `<title>{…}</title>` dans le JSX
  (hoisté automatiquement dans le `<head>`) — plus simple, sans effect.
- Option : afficher la même chose dans la barre de titre Win95
  (`Discogs Roulette.exe - Jazz · 1959`).
