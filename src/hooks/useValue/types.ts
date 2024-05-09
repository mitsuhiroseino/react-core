import { ChangeableProps } from '../../features/Changeable';
import { HasValueProps } from '../../features/HasValue';

/**
 * 値を持つコンポーネントのプロパティ
 */
export type UseValueProps<V = any> = HasValueProps<V> & ChangeableProps<V>;

/**
 * useValueのオプション
 */
export type UseValueOptions<V = any> = {
  /**
   * valueがnull,undefinedだった場合の値
   */
  defaultValue?: V;
};
