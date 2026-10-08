'use client'

import type { SelectOption } from "../types/select";

const FIRST_YEAR = 1950;
const LAST_YEAR = 2026;

type YearMode = "single" | 5 | 10;

const yearOptions: SelectOption[] = [];
for (let year = LAST_YEAR; year >= FIRST_YEAR; year--) {
  yearOptions.push({ value: year.toString(), label: year.toString() });
}

// tranches alignées sur les multiples de `step` (2020–2026, 2010–2019… / 2025–2026,
// 2020–2024…) — la value "1990-1999" part telle quelle dans le paramètre `year` de
// /database/search, que Discogs accepte comme plage (vérifié sur l'API)
const yearRangeOptions = (step: 5 | 10): SelectOption[] => {
  const options: SelectOption[] = [];
  for (let start = Math.floor(LAST_YEAR / step) * step; start >= FIRST_YEAR; start -= step) {
    const end = Math.min(start + step - 1, LAST_YEAR);
    options.push({ value: `${start}-${end}`, label: `${start}–${end}` });
  }
  return options;
};

const yearOptionsFor = (mode: YearMode): SelectOption[] =>
  mode === "single" ? yearOptions : yearRangeOptions(mode);

// "1990-1999" → "1990–1999" pour l'affichage (bouton, titre, message d'erreur)
const formatYear = (year: string) => year.replace("-", "–");

export { yearOptions, yearRangeOptions, yearOptionsFor, formatYear };
export type { YearMode };
