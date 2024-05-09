import ComponentBridge from '../ComponentBridge';
import ComponentBridgeOptions from '../ComponentBridgeOptions';
import ComponentBridgeProps from '../ComponentBridgeProps';
import ComponentBridgeFeatureOptions from './FeatureBridgeOptions';

interface FeatureBridge<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O extends ComponentBridgeOptions = ComponentBridgeOptions,
> {
  /**
   * プロパティ更新時の処理
   * @param bridge ブリッジ
   * @param newProps 更新後のプロパティ
   * @param oldProps 更新前のプロパティ
   * @param options オプション
   */
  update(bridge: ComponentBridge<C, P, O>, newProps: P, oldProps: P, options: ComponentBridgeFeatureOptions<O>): void;

  /**
   * 当クラスを破棄する際の処理
   * @param bridge ブリッジ
   * @param options オプション
   */
  destructor(bridge: ComponentBridge<C, P, O>, options: ComponentBridgeFeatureOptions<O>): void;
}
export default FeatureBridge;
