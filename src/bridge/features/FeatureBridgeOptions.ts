import ComponentBridge from '../ComponentBridge';
import ComponentBridgeOptions from '../ComponentBridgeOptions';

/**
 * ブリッジの各機能実行時に渡すオプション値
 */
type FeatureBridgeOptions<O = ComponentBridgeOptions, B extends ComponentBridge = any> = O & {
  /**
   * ブリッジ
   */
  bridge: B;
};
export default FeatureBridgeOptions;
