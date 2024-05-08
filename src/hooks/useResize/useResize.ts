import pick from 'lodash/pick';
import { MutableRefObject, useCallback, useEffect } from 'react';

import useForwardedRef from '../useForwardedRef';
import { UseResizeOptions, UseResizeRect } from './types';

const RECT_PROPS = ['width', 'height', 'top', 'bottom', 'left', 'right', 'x', 'y'];

/**
 * elementにwidth,height変更時のハンドラーを設定する
 * @param onResize ハンドラー
 * @param options オプション
 */
export default function useResize<I extends HTMLElement = HTMLElement>(
  onResize: (contentRect: UseResizeRect, element: I) => void,
  options: UseResizeOptions<I> = {},
): [(instance: I | null) => void, MutableRefObject<I | null>] {
  const { deps = [], ref, disabled } = options,
    [setRef, currenrRef] = useForwardedRef(ref),
    handleResize = useCallback(onResize, deps);

  useEffect(() => {
    const element = currenrRef.current;
    if (handleResize && element && !disabled) {
      // サイズ変更時
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];

        handleResize(pick(entry.contentRect, RECT_PROPS) as UseResizeRect, element);
      });
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    }
  }, [handleResize, currenrRef.current, disabled]);

  return [setRef, currenrRef];
}
