import animateColors from '@visue/web-core/utils/anim/animateColors';

import useValueAnimation from '../useValueAnimation';
import { UseColorsAnimationOptions } from './types';

/**
 * フレームを使用したアニメーションを行う
 * @param value 数値
 * @param isEnabled アニメーションの有効／無効
 * @param options オプション
 */
export default function useFramesAnimation(
  value: number | undefined,
  isEnabled: boolean | undefined,
  options: UseColorsAnimationOptions = {},
) {
  return useValueAnimation(value, isEnabled, options, animateColors);
}
