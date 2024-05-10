import {ThunkAction} from '@reduxjs/toolkit';
import {ShoppingListItem} from '../../../model/types';
import {UnknownMetadata} from '../../../utils/types';
import {UIShoppingListItem} from '../types';
import {RootState} from '../../../redux/store';

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
  toggleItemInteractions: ToggledItem[];
  bottomSheet: BottomSheet;
}

export const initialState: ShoppingListState = {
  headerInfo: {listName: '', progress: 0},
  items: [],
  toggleItemInteractions: [],
  bottomSheet: {isVisible: false},
};

export type CreateOrUpdateItemArgs = {
  listId: string;
  shoppingListItem: ShoppingListItem;
};

export type ToggledItem = {
  itemId: string;
  checked: boolean;
};

export type ThunkToggleItems = {
  listId: string;
  interaction: ToggledItem;
};

export type ToggleItemArgs = {
  listId: string;
  interactions: ToggledItem[];
};

export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>;
