import { CALC_VALUE } from '@visue/web-core/utils/anim/animateDate';

import useValueAnimation from '../useValueAnimation';
import { UseDateAnimationOptions } from './types';

/**
 * 日付の変更時のアニメーションを行う
 * @param value 日付
 * @param isEnabled アニメーションの有効／無効
 * @param options オプション
 */
export default function useDateAnimation(
  value: Date | null | undefined,
  isEnabled: boolean | undefined,
  options: UseDateAnimationOptions = {},
) {
  return useValueAnimation(value, isEnabled, { ...options, calcValue: CALC_VALUE });
}
