import concat from 'lodash/concat';
import { DependencyList, useMemo, useRef } from 'react';

/**
 * 一覧項目用のハンドラーを取得する
 * @param createHandler ハンドラーを作る関数
 * @param items 行データ
 * @param deps 依存する変数
 */
export default function useHandlers<T = any>(
  createHandler: (item: T, index: number) => Function,
  items: T[],
  deps: DependencyList = [],
) {
  const handlersRef = useRef<(Function | undefined)[]>(),
    itemsRef = useRef<T[]>(),
    dependencies = concat([items], deps),
    handlers = useMemo(() => {
      // 前回のハンドラ
      const cachedHandlers = handlersRef.current,
        // 前回のItems
        prevItems = itemsRef.current;
      return items.map((item, index) => {
        if (!prevItems || item !== prevItems[index]) {
          // 初回 or 前回とitemが異なる場合は新しいハンドラーを作る
          return createHandler(item, index);
        } else if (cachedHandlers) {
          // 前回のハンドラを使いまわす
          return cachedHandlers[index];
        }
      });
    }, dependencies);
  handlersRef.current = handlers;
  return handlers;
}
