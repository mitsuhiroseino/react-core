import HasValue from '../HasValue';
import createFeature from '../createFeature';
import { HasChangeableValueProps } from './types';

/**
 * 変更可能な値を持つコンポーネント
 */
const HasChangeableValue = createFeature<HasChangeableValueProps>({
  name: 'HasChangeableValue',
  deps: [HasValue],
  props: {
    onChange: true,
    ...HasValue.props,
  },
});
export default HasChangeableValue;
