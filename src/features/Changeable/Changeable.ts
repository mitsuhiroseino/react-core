import createFeature from '../createFeature';
import { ChangeableProps } from './types';

/**
 * 変更可能な値を持つコンポーネント
 */
const Changeable = createFeature<ChangeableProps>({
  name: 'Changeable',
  props: {
    onChange: true,
  },
});
export default Changeable;
