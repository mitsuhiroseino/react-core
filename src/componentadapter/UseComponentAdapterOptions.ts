import { ForwardedRef, MutableRefObject, Ref, RefObject } from 'react';

import AdapterOptions from './adapter/AdapterOptions';

/**
 * adapterのオプション
 */
type UseComponentAdapterOptions<C = HTMLElement, O = AdapterOptions> = O & {
  /**
   * コンポーネントのインスタンスを設定するref
   */
  ref?: Ref<C> | ForwardedRef<C>;

  /**
   * 描画対象のHTMLエレメントのRef
   * インスタンス生成後にHTMLエレメントへ追加する必要がある場合に指定
   */
  targetRef?: RefObject<HTMLElement> | MutableRefObject<HTMLElement>;

  /**
   * targetにHTMLEmentのインスタンスを追加するタイミングを遅らせる場合にミリ秒で指定
   */
  renderingDelay?: number;
};
export default UseComponentAdapterOptions;
