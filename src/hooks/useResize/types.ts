import { ForwardedRef } from 'react';

export type UseResizeOptions<I extends HTMLElement = HTMLElement> = {
  /**
   * フォワードされたref
   */
  ref?: ForwardedRef<I | null>;

  /**
   * onResize関数を作り直すトリガーになる変数
   */
  deps?: any[];

  /**
   * 無効
   */
  disabled?: boolean;
};

export type UseResizeRect = {
  width: number;
  height: number;
  x?: number;
  y?: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};
