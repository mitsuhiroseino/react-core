import { EntryItem } from '@visue/core/data/entries';

/**
 * 変更可能な値を持つコンポーネントのプロパティ
 */
export type EditableProps<I extends EntryItem = EntryItem> = {
  /**
   * 要素編集時のイベントハンドラー
   * @param editedItem 編集された要素
   * @returns
   */
  onEdit?: (editedItem: I) => void;
};
