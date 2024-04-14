import pick from 'lodash/pick';
import { useCallback, useEffect, useMemo } from 'react';

import { UseResizeRect } from './types';

/**
 * elementにwidth,height変更時のハンドラーを設定する
 * @param ref elementを参照するref
 * @param onResize ハンドラー
 */
export default function useFlexFontSize(text: string, element: HTMLElement): void {
  const fontSize = useMemo(() => {}, [text, element]);
}
