import { HasValueProps } from '../HasValue';

/**
 * 変更可能な値を持つコンポーネントのプロパティ
 */
export type HasChangeableValueProps<V = any> = HasValueProps<V> & {
  /**
   * 値変更時のイベントハンドラー
   * @param newValue 新しい値
   * @returns
   */
  onChange: (newValue: V) => void;
};
