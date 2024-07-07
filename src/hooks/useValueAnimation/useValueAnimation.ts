import applyIf from '@visue/utils/function/applyIf';
import animateValue from '@visue/web-core/utils/anim/animateValue';
import identity from 'lodash/identity';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { UseValueAnimationOptions } from './types';

/**
 * 値変更時のアニメーションを行う
 * @param value 値
 * @param isEnabled アニメーションの有効／無効
 * @param options オプション
 */
export default function useValueAnimation(
  value: any | undefined,
  isEnabled: boolean | undefined,
  options: UseValueAnimationOptions<any> = {},
  animateFn: (value: any, setValue: (value: any) => void, options: any) => any = animateValue,
): any | undefined {
  // 前回の値
  const { initialValue, enableNoInitialValue, staticInitialValue, setValue, convert = identity } = options,
    previousValueRef = useRef<any>(initialValue),
    // 初期値なし & 初期値がない場合は無効の場合はアニメーションなし
    noAnimation = (staticInitialValue ? initialValue : previousValueRef.current) == null && !enableNoInitialValue,
    // アニメーションなしの場合は現在の値をステートの初期値とする
    [state, setState] = useState<any>(convert(noAnimation ? value : initialValue)),
    // アニメーション完了時にステートへ値を渡すための処理
    updateState = useCallback<(currentValue: any | undefined) => void>(
      (currentValue: any | undefined) => {
        // 値を編集してsetStateに渡す
        setState(convert(currentValue));
      },
      [convert],
    ),
    // アニメーション中の値を反映するための関数
    setAnimatedValue = useMemo<(currentValue: any | undefined) => void>(() => {
      if (setValue) {
        // domを直接更新する場合
        return (currentValue: any | undefined) => setValue(convert(currentValue));
      } else {
        // ステートを介して更新する場合
        return updateState;
      }
    }, [convert, setValue, updateState]);

  // 値変更時のアニメーション
  useEffect(() => {
    if (isEnabled && !noAnimation) {
      // アニメーションあり
      const { onComplete, staticInitialValue, ...rest } = options,
        opts = {
          ...rest,
          onComplete: () => {
            updateState(value);
            applyIf(onComplete);
          },
        };
      if (!staticInitialValue) {
        // 前回の値を初期値として扱う
        const previousValue = previousValueRef.current;
        opts.initialValue = previousValue;
      }
      previousValueRef.current = value;
      // アニメーション開始
      const cancel = animateFn(value, setAnimatedValue, opts);
      return () => {
        cancel();
        updateState(value);
      };
    } else {
      // アニメーションなし
      updateState(value);
      previousValueRef.current = value;
    }
  }, [value, isEnabled, noAnimation]);

  return state;
}
