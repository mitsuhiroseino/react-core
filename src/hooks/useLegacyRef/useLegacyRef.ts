import isFunction from 'lodash/isFunction';
import { ForwardedRef, LegacyRef, useEffect, useRef } from 'react';

/**
 * forwardRefで渡されたrefをLegacyRefに変換するhooks
 * @param forwardedRef
 * @returns refオブジェクト
 */
export default function useLegacyRef<I>(forwardedRef: ForwardedRef<I>): LegacyRef<I> {
  const ref = useRef<I>(null);
  useEffect(() => {
    if (ref.current !== undefined) {
      if (isFunction(forwardedRef)) {
        forwardedRef(ref.current);
      } else if (forwardedRef) {
        forwardedRef.current = ref.current;
      }
    }
  }, []);

  return ref;
}
