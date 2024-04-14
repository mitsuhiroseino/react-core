import { Adapter, AdapterOptions, AdapterProps } from '../adapter';
import AdapterFeatureOptions from './AdapterFeatureOptions';

interface AdapterFeature<
  C = HTMLElement,
  P extends AdapterProps<C> = AdapterProps<C>,
  O extends AdapterOptions = AdapterOptions,
> {
  /**
   * プロパティ更新時の処理
   * @param adapter アダプター
   * @param newProps 更新後のプロパティ
   * @param oldProps 更新前のプロパティ
   * @param options オプション
   */
  update(adapter: Adapter<C, P, O>, newProps: P, oldProps: P, options: AdapterFeatureOptions<O>): void;

  /**
   * 当クラスを破棄する際の処理
   * @param adapter アダプター
   * @param options オプション
   */
  destructor(adapter: Adapter<C, P, O>, options: AdapterFeatureOptions<O>): void;
}
export default AdapterFeature;
