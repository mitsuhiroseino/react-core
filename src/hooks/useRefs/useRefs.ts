import { ForwardedRef, MutableRefObject, useCallback, useEffect, useRef } from 'react';
import setRef from '../../utils/setRef';

/**
 * 配列形式のref
 * @param defaultValues
 * @param forwardedRef
 * @returns [コンポーネントに渡すref関数, 自身が使用するrefオブジェクト]
 */
export default function useRefs<I>(
  forwardedRef?: ForwardedRef<(I | null)[]>,
  defaultValues: I[] = [],
): [(index: number) => (instance: I | null) => void, MutableRefObject<(I | null)[]>] {
  const ref = useRef<(I | null)[]>(defaultValues),
    createRef = useCallback(
      (index: number) => (instance: I | null) => {
        ref.current[index] = instance;
      },
      [],
    );

  useEffect(() => {
    setRef(forwardedRef, ref.current);
  }, []);

  return [createRef, ref];
}
