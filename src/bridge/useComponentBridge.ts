import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import { useEffect, useState } from 'react';
import useForwardedRef from '../hooks/useForwardedRef';
import ComponentBridge from './ComponentBridge';
import ComponentBridgeDefinition from './ComponentBridgeDefinition';
import ComponentBridgeOptions from './ComponentBridgeOptions';
import ComponentBridgeProps from './ComponentBridgeProps';
import UseComponentBridgeOptions from './UseComponentBridgeOptions';

/**
 * ReactのコンポーネントとインスタンスでDOMを制御するタイプのコンポーネントの橋渡しをするHooks
 * @param create コンポーネントのインスタンスを返す関数、またはエレメントのタグ名、または任意のインスタンス
 * @param bridgeDefinition ブリッジの定義
 * @param props Reactのコンポーネントに渡されたプロパティ
 * @param options オプション
 * @returns
 */
export default function useComponentBridge<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O = ComponentBridgeOptions,
>(
  create: (() => C) | string | C,
  bridgeDefinition: ComponentBridgeDefinition<C, P, O>,
  props: P,
  options: UseComponentBridgeOptions<C, O> = {} as UseComponentBridgeOptions<C, O>,
): C {
  const { ref, targetRef, renderingDelay, ...rest } = options,
    bridgeOptions: O = rest as O,
    [setter] = useForwardedRef<C>(ref),
    [bridge, setBridge] = useState<ComponentBridge<C, P, O>>(),
    { recreationTriggers = [] } = bridgeDefinition,
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
      newBridge = new ComponentBridge<C, P, O>(instance, bridgeDefinition, props, bridgeOptions);
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
    setBridge(newBridge);
    return () => {
      if (newBridge) {
        newBridge.destructor();
        setter(null);
        setBridge(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, recreationDeps);

  useEffect(() => {
    if (bridge) {
      // propsは常に最新の状態に更新
      bridge.update(props, bridgeOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, bridge]);

  return bridge?.instance;
}
