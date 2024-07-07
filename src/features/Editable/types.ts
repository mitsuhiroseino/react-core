import { EntityItem } from '@visue/data/entities';

/**
 * 変更可能な値を持つコンポーネントのプロパティ
 */
export type EditableProps<I extends EntityItem = EntityItem> = {
  /**
   * 要素編集時のイベントハンドラー
   * @param editedItem 編集された要素
   * @returns
   */
  onEdit?: (editedItem: I) => void;
};
