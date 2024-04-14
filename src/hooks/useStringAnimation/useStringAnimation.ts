import { CALC_VALUE } from '@visue/web-core/utils/anim/animateString';

import useValueAnimation from '../useValueAnimation';
import { UseStringAnimationOptions } from './types';

/**
 * 文字列の変更時のアニメーションを行う
 * @param value 文字列
 * @param isEnabled アニメーションの有効／無効
 * @param options オプション
 */
export default function useStringAnimation(
  value: string | undefined,
  isEnabled: boolean | undefined,
  options: UseStringAnimationOptions = {},
) {
  return useValueAnimation(value, isEnabled, { ...options, calcValue: CALC_VALUE });
}
