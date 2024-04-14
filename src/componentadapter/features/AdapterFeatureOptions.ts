import Adapter from '../adapter/Adapter';
import AdapterOptions from '../adapter/AdapterOptions';

/**
 * アダプターの各機能実行時に渡すオプション値
 */
type AdapterFeatureOptions<O = AdapterOptions, A extends Adapter = any> = O & {
  /**
   * アダプター
   */
  adapter: A;
};
export default AdapterFeatureOptions;
