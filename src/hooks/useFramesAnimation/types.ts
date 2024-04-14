import { AnimateFramesOptions } from '@visue/web-core/utils/anim/animateFrames';

import { UseValueAnimationOptions } from '../useValueAnimation';

/**
 * オプション
 */
export type UseNumberAnimationOptions = Omit<UseValueAnimationOptions, 'calcValue'> & AnimateFramesOptions;
