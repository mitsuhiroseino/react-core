import { ForwardedRef, forwardRef, useEffect } from 'react';
import useForwardedRef from '../../hooks/useForwardedRef';

export type WithResizeProps = {
  onSizeChange?: (contentRect: DOMRectReadOnly, entry: ResizeObserverEntry) => void;
};

/**
 * propsをログに出力
 * @param ComposedComponent
 */
export default function withResize<P = any, R = any>(ComposedComponent: any) {
  return forwardRef(function (props: P & WithResizeProps, ref: ForwardedRef<R>) {
    const { onSizeChange, ...rest } = props,
      [setRef, currentRef] = useForwardedRef<R>(ref);

    useEffect(() => {
      if (onSizeChange) {
        const resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          onSizeChange(entry.contentRect, entry);
        });
        if (currentRef.current) {
          resizeObserver.observe(currentRef.current as any);
        }
        return () => {
          resizeObserver.disconnect();
        };
      }
    }, [onSizeChange, currentRef]);

    return <ComposedComponent ref={setRef} {...rest} />;
  });
}
