import { Adapter, AdapterOptions, AdapterProps } from '../../adapter';
import AdapterFeatureOptions from '../AdapterFeatureOptions';

/**
 * Reactのプロパティの更新をトリガーとしてコンポーネントの操作を実行する為の定義
 */
type EffectDefinition<
  C = HTMLElement,
  P extends AdapterProps<C> = AdapterProps<C>,
  O extends AdapterOptions = AdapterOptions,
> = {
  /**
   * コンポーネントの操作を実行するトリガーとなるプロパティ
   * ここに指定したプロパティが変更された際にcallbackが実行される
   */
  propNames: string[];

  /**
   * コンポーネントのインスタンスにコンフィグを反映する為の処理など
   */
  callback: (adapter: Adapter<C, P, O>, props: P, oldProps: P, options: AdapterFeatureOptions<O>) => void;
};
export default EffectDefinition;
