'use client'

import type { SelectOption } from "../types/select";

const yearOptions: SelectOption[] = [];
for (let year = 2026; year >= 1950; year--) {
  yearOptions.push({ value: year.toString(), label: year.toString() });
}

export { yearOptions };
