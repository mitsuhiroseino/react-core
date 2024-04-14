import animateFrames from '@visue/web-core/utils/anim/animateFrames';

import useValueAnimation from '../useValueAnimation';
import { UseNumberAnimationOptions } from './types';

/**
 * フレームを使用したアニメーションを行う
 * @param value 数値
 * @param isEnabled アニメーションの有効／無効
 * @param options オプション
 */
export default function useFramesAnimation(
  value: number | undefined,
  isEnabled: boolean | undefined,
  options: UseNumberAnimationOptions = {},
) {
  return useValueAnimation(value, isEnabled, options, animateFrames);
}
