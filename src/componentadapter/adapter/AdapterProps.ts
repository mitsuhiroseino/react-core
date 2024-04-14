/**
 * React用にラップしたコンポーネントのプロパティ
 */
type AdapterProps<C = HTMLElement> = {
  /**
   * コンポーネントのインスタンス作成時のハンドラ
   * @param instance
   * @returns
   */
  onInitialize?: (instance: C) => void;
};

export default AdapterProps;
