import { ForwardedRef, MutableRefObject, useCallback, useRef } from 'react';
import setRef from '../../utils/setRef';

/**
 * forwardRefで渡されたrefと自身のrefを同じコンポーネントに渡すためのhooks
 * @param forwardedRef
 * @returns [コンポーネントに渡すref関数, 自身が使用するrefオブジェクト]
 */
export default function useForwardedRef<I>(
  forwardedRef?: ForwardedRef<I | null>,
): [(instance: I | null) => void, MutableRefObject<I | null>] {
  const ref = useRef<I | null>(null),
    setter = useCallback(
      (instance: I | null) => {
        setRef(forwardedRef, instance);
        ref.current = instance;
      },
      [forwardedRef],
    );
  return [setter, ref];
}
