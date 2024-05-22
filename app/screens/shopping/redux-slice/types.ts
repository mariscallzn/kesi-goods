import {ThunkAction} from '@reduxjs/toolkit';
import {UIModelProps} from '../../../inf/multiViewRenderer';
import {ShoppingListItem} from '../../../model/types';
import {RootState} from '../../../redux/store';
import {UnknownMetadata} from '../../../utils/types';

interface HeaderInfo {
  listName: string;
  progress: number;
  searchEnabled: boolean;
  searchTerm?: string;
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

interface SnackbarState {
  visible: boolean;
  message: string;
  metadata: UnknownMetadata;
}

export interface ShoppingListState {
  headerInfo: HeaderInfo;
  items: UIModelProps[];
  toggleItemInteractions: ToggledItem[];
  bottomSheet: BottomSheet;
  snackbar: SnackbarState;
}

export const initialState: ShoppingListState = {
  headerInfo: {
    listName: '',
    progress: 0,
    searchEnabled: false,
  },
  items: [],
  toggleItemInteractions: [],
  bottomSheet: {isVisible: false},
  snackbar: {
    message: '',
    visible: false,
    metadata: {type: '', value: undefined},
  },
};

export type ListIdShoppingItemArgs = {
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

export type FetchListInfoArgs = {
  listId: string;
  searchTerm?: string;
};

export type RestoreShoppingListArgs = {
  listId: string;
  metadata: UnknownMetadata;
};

export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>;
