'use client';

import Select from 'react-select';
import type { SelectOption } from '../types/select';

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
    />
  );
};

export { SelectComponent };
