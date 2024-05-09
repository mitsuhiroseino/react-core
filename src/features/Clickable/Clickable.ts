import createFeature from '../createFeature';
import { ClickableProps } from './types';

/**
 * 変更可能な値を持つコンポーネント
 */
const Clickable = createFeature<ClickableProps>({
  name: 'Clickable',
  props: {
    onClick: true,
  },
});
export default Clickable;
