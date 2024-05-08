import ComponentBridge from '../../ComponentBridge';
import ComponentBridgeOptions from '../../ComponentBridgeOptions';
import ComponentBridgeProps from '../../ComponentBridgeProps';
import BridgeFeatureOptions from '../BridgeFeatureOptions';

/**
 * Reactのプロパティの更新をトリガーとしてコンポーネントの操作を実行する為の定義
 */
type EffectDefinition<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O extends ComponentBridgeOptions = ComponentBridgeOptions,
> = {
  /**
   * コンポーネントの操作を実行するトリガーとなるプロパティ
   * ここに指定したプロパティが変更された際にcallbackが実行される
   */
  propNames: string[];

  /**
   * コンポーネントのインスタンスにコンフィグを反映する為の処理など
   */
  callback: (bridge: ComponentBridge<C, P, O>, props: P, oldProps: P, options: BridgeFeatureOptions<O>) => void;
};
export default EffectDefinition;
