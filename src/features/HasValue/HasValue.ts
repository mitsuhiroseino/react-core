import createFeature from '../createFeature';
import { HasValueProps } from './types';

const HasValue = createFeature<HasValueProps>({
  name: 'HasValue',
  props: {
    value: true,
  },
});
export default HasValue;
