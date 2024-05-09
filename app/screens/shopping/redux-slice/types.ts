import {ShoppingListItem} from '../../../model/types';
import {UnknownMetadata} from '../../../utils/types';
import {UIShoppingListItem} from '../types';

interface HeaderInfo {
  listName: string;
  progress: number;
}

interface BottomSheet {
  isVisible: boolean;
  /**
   * (Optional)
   * Used to notify the consumer that there is a Async operation going on
   */
  isLoading?: boolean;
  metadata?: UnknownMetadata;
}

export interface ShoppingListState {
  headerInfo: HeaderInfo;
  items: UIShoppingListItem[];
  bottomSheet: BottomSheet;
}

export const initialState: ShoppingListState = {
  headerInfo: {listName: '', progress: 0},
  items: [],
  bottomSheet: {isVisible: false},
};

export type CreateOrUpdateItemArgs = {
  listId: string;
  shoppingListItem: ShoppingListItem;
};
