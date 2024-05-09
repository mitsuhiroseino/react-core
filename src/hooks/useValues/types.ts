import { ChangeableProps } from '../../features/Changeable';
import { HasValueProps } from '../../features/HasValue';

/**
 * useValuesのプロパティ
 */
export type UseValuesProps<V = any> = HasValueProps<V[]> & ChangeableProps<V[]>;

/**
 * useValuesのオプション
 */
export type UseValuesOptions<V = any> = {
  /**
   * valueがnull,undefinedだった場合の値
   */
  defaultValues?: V[];
};
