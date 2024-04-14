import asArray from '@visue/core/utils/array/asArray';
import toOptionItem from '@visue/core/utils/data/toOptionItem';
import { useMemo } from 'react';

export default function useOptions<O = { value: unknown; label: string }>(optionItems?: any[]) {
  return useMemo(() => asArray(optionItems).map((item) => toOptionItem<O>(item)), [optionItems]);
}
