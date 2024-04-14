import { AnimateColorsOptions } from '@visue/web-core/utils/anim/animateColors';

import { UseValueAnimationOptions } from '../useValueAnimation';

/**
 * オプション
 */
export type UseColorsAnimationOptions = Omit<UseValueAnimationOptions, 'calcValue'> & AnimateColorsOptions;
