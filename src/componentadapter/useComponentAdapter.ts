import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { useEffect, useState } from 'react';

import useForwardedRef from '../hooks/useForwardedRef';
import UseComponentAdapterOptions from './UseComponentAdapterOptions';
import { Adapter, AdapterDefinition, AdapterOptions, AdapterProps } from './adapter';

/**
 * ReactのコンポーネントとインスタンスでDOMを制御するタイプのコンポーネントの橋渡しをするHooks
 * @param create コンポーネントのインスタンスを返す関数、またはエレメントのタグ名、または任意のインスタンス
 * @param adapterDefinition アダプターの定義
 * @param props Reactのコンポーネントに渡されたプロパティ
 * @param options オプション
 * @returns
 */
export default function useComponentAdapter<
  C = HTMLElement,
  P extends AdapterProps<C> = AdapterProps<C>,
  O = AdapterOptions,
>(
  create: (() => C) | string | C,
  adapterDefinition: AdapterDefinition<C, P, O>,
  props: P,
  options: UseComponentAdapterOptions<C, O> = {} as UseComponentAdapterOptions<C, O>,
): C {
  const { ref, targetRef, renderingDelay, ...rest } = options,
    adapterOptions: O = rest as O,
    [setter] = useForwardedRef<C>(ref),
    [adapter, setAdapter] = useState<Adapter<C, P, O>>(),
    { recreationTriggers = [] } = adapterDefinition,
    recreationDeps = recreationTriggers.map((propName) => props[propName]);

  // インスタンスの作成 & インスタンス破棄時の処理
  // recreationTriggersに指定されたプロパティの値が変更されたら、コンポーネントのインスタンスを作成
  // targetRefからDOMのインスタンスを取得する必要があるコンポーネントもある為、
  // useMemoではなくuseEffectでインスタンスを作成する。
  useEffect(() => {
    const instance: C = isFunction(create)
        ? create()
        : isString(create)
          ? (document.createElement(create) as any)
          : create,
      newAdapter = new Adapter<C, P, O>(instance, adapterDefinition, props, adapterOptions);
    if (targetRef?.current && instance instanceof HTMLElement) {
      if (renderingDelay != null) {
        setTimeout(() => {
          targetRef.current.appendChild(instance);
        }, renderingDelay);
      } else {
        targetRef.current.appendChild(instance);
      }
    }
    setter(instance);
    const { onInitialize } = props;
    onInitialize && onInitialize(instance);
    setAdapter(newAdapter);
    return () => {
      if (newAdapter) {
        newAdapter.destructor();
        setter(null);
        setAdapter(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, recreationDeps);

  useEffect(() => {
    if (adapter) {
      // propsは常に最新の状態に更新
      adapter.update(props, adapterOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, adapter]);

  return adapter?.instance;
}
