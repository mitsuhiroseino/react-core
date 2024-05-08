/**
 * React用にラップしたコンポーネントのプロパティ
 */
type ComponentBridgeProps<C = HTMLElement> = {
  /**
   * コンポーネントのインスタンス作成時のハンドラ
   * @param instance
   * @returns
   */
  onInitialize?: (instance: C) => void;
};

export default ComponentBridgeProps;
