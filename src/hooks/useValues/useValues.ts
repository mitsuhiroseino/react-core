import asArray from '@visue/utils/array/asArray';
import noop from 'lodash/noop';
import { UseValuesOptions, UseValuesProps } from './types';

/**
 * feature: HasValue用Hook
 * @param props
 */
export default function useValues<V, P extends UseValuesProps<V> = UseValuesProps<V>>(
  props: P,
  options: UseValuesOptions = {},
) {
  const { defaultValues = [] } = options;
  const { value, onChange, ...rest } = props;
  const reusltProps = rest as P;

  if (value == null && defaultValues !== undefined) {
    reusltProps.value = defaultValues;
  } else {
    reusltProps.value = asArray(value);
  }

  reusltProps.onChange = onChange || noop;

  return reusltProps;
}
