/**
 * コンポーネントの機能の定義
 */
export type Feature<P extends Record<string, any>> = FeatureConfig<P> & {
  /**
   * 当機能の依存する機能のマップ
   */
  depMap?: { [name: string]: Feature<unknown> };
};

/**
 * コンポーネントの機能の定義の設定
 */
export type FeatureConfig<P extends Record<string, any>> = {
  /**
   * 機能名
   */
  name: string;

  /**
   * 当機能の依存する機能
   */
  deps?: Feature<unknown>[];

  /**
   * 機能が持つプロパティ
   */
  props?: Props<P>;

  /**
   * 機能の利用時に実行する必要があるuseMemo相当の処理
   * @param props
   * @returns
   */
  useMemo?: (props: P) => P;
};

/**
 * 機能の持つプロパティ
 */
type Props<P> = { [K in keyof Required<P>]: Prop };

/**
 * プロパティ毎の設定
 */
type Prop = boolean | {};
