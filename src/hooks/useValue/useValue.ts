import noop from 'lodash/noop';
import { UseValueOptions, UseValueProps } from './types';

/**
 * feature: HasValue用Hook
 * @param props
 */
export default function useValue<V, P extends UseValueProps<V> = UseValueProps<V>>(
  props: P,
  options: UseValueOptions = {},
) {
  const { defaultValue = '' } = options;
  const { value, onChange, ...rest } = props;
  const reusltProps = rest as P;

  if (value == null && defaultValue !== undefined) {
    reusltProps.value = defaultValue;
  } else {
    reusltProps.value = value;
  }

  reusltProps.onChange = onChange || noop;

  return reusltProps;
}
