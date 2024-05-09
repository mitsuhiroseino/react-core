/**
 * 変更可能な値を持つコンポーネントのプロパティ
 */
export type ChangeableProps<V = any> = {
  /**
   * 値変更時のイベントハンドラー
   * @param newValue 新しい値
   * @returns
   */
  onChange: (newValue: V) => void;
};
