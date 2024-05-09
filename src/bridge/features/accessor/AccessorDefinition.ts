import ComponentBridgeOptions from '../../ComponentBridgeOptions';
import FeatureBridgeOptions from '../FeatureBridgeOptions';

/**
 * コンポーネントのプロパティへのアクセスに関する定義
 * ここで定義したプロパティへDhex.getおよびDhex.setでアクセスをした場合は、
 * 値またはインスタンスの変更があった場合のみコンポーネントのプロパティへ反映される。
 */
type AccessorDefinition<C, P, O extends ComponentBridgeOptions = ComponentBridgeOptions> = {
  /**
   * 対象のプロパティ名
   */
  propName: string;

  /**
   * 対象のプロパティを取得する為の処理
   * @param props プロパティ
   * @param options
   * @returns
   */
  get?: (instance: C, props: P, options: FeatureBridgeOptions<O>) => unknown;

  /**
   * 対象のプロパティに値を設定する為の処理
   * @param value
   * @param options
   * @returns
   */
  set?: (instance: C, value: unknown, props: P, options: FeatureBridgeOptions<O>) => void;

  /**
   * 値の簡易チェック。
   * falseを返した場合はコンポーネントのインスタンスへ値を渡さない。
   * あくまでもコンポーネントに想定外の動作をさせない為の仕組みなので、
   * WPNXのコンポーネントとしてのバリデーションの仕組みは別途必要。
   * @returns チェック結果
   */
  validate?: (instance: C, value: unknown) => boolean;

  /**
   * getで取得した値を変換する
   */
  convertFrom?: (instance: C, value: unknown, props: P, options: FeatureBridgeOptions<O>) => unknown;

  /**
   * setする値を変換する
   */
  convertTo?: (instance: C, value: unknown, props: P, options: FeatureBridgeOptions<O>) => unknown;

  /**
   * オブジェクトや配列配下の要素の比較を行う。オブジェクトや配列のインスタンスが異なる場合でも配下の値が一致する場合は一致として扱う。
   * - true: 値が異なる場合にのみgetterで処理を行う
   * - false or 未設定: 値またはインスタンスが異なる場合にgetterで処理を行う
   */
  deepComparison?: boolean;

  /**
   * 以前設定されていた値に関わらず、コンポーネントのインスタンスへ常に値の反映を行うか
   * - true: コンポーネントのインスタンスへ常に値を反映する
   * - false or 未設定: 以前アクセサーを介して主tくした値と今回設定する値が異なる場合のみ、コンポーネントのインスタンスへ値を反映する
   */
  alwaysSet?: boolean;
};
export default AccessorDefinition;
