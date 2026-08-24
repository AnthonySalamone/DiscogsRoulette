'use client';

import Select, { type StylesConfig } from 'react-select';
import type { SelectOption } from '../types/select';

// combo-box Windows 95 : champ enfoncé (sunken), flèche en bouton relevé (raised),
// menu carré, sélection bleu marine — react-select vient avec son propre thème par
// défaut qu'il faut entièrement recolorer pour matcher.
const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--win95-white)',
    borderRadius: 0,
    borderTop: `2px solid var(--win95-gray-dark)`,
    borderLeft: `2px solid var(--win95-gray-dark)`,
    borderRight: `2px solid var(--win95-white)`,
    borderBottom: `2px solid var(--win95-white)`,
    boxShadow: state.isFocused
      ? 'inset 1px 1px 0 var(--win95-black), inset -1px -1px 0 var(--win95-highlight), 0 0 0 1px var(--win95-navy)'
      : 'inset 1px 1px 0 var(--win95-black), inset -1px -1px 0 var(--win95-highlight)',
    minHeight: '2.25rem',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--win95-white)',
    borderRadius: 0,
    border: '2px solid var(--win95-black)',
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 0,
    backgroundColor: state.isSelected || state.isFocused ? 'var(--win95-navy)' : 'var(--win95-white)',
    color: state.isSelected || state.isFocused ? 'var(--win95-white)' : 'var(--win95-black)',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--win95-black)',
  }),
  input: (base) => ({
    ...base,
    color: 'var(--win95-black)',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--win95-gray-dark)',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--win95-black)',
  }),
};

const SelectComponent = ({ options, instanceId, onChange }: {
  options: SelectOption[];
  instanceId: string;
  onChange?: (option: SelectOption | null) => void;
}) => {
  return (
    <Select
      options={options}
      instanceId={instanceId}
      onChange={onChange}
      styles={selectStyles}
    />
  );
};

export { SelectComponent };
