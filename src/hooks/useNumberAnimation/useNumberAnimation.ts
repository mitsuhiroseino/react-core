import { CALC_VALUE } from '@visue/web-core/utils/anim/animateNumber';

import useValueAnimation from '../useValueAnimation';
import { UseNumberAnimationOptions } from './types';

/**
 * 数値の変更時のアニメーションを行う
 * @param value 数値
 * @param isEnabled アニメーションの有効／無効
 * @param options オプション
 */
export default function useNumberAnimation(
  value: number | null | undefined,
  isEnabled: boolean | undefined,
  options: UseNumberAnimationOptions = {},
) {
  return useValueAnimation(value, isEnabled, { ...options, calcValue: CALC_VALUE });
}
