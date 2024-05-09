/**
 * クリックできる
 */
export type ClickableProps<A extends [] = []> = {
  /**
   * 値変更時のイベントハンドラー
   * @param args 引数
   * @returns
   */
  onClick: (...args: A) => void;
};
