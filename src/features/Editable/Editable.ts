import createFeature from '../createFeature';
import { EditableProps } from './types';

/**
 * 配列の値の1要素を変更可能なコンポーネント
 */
const Editable = createFeature<EditableProps>({
  name: 'Editable',
  props: {
    onEdit: true,
  },
});
export default Editable;
