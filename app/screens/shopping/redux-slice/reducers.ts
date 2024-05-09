import {ActionReducerMapBuilder, PayloadAction} from '@reduxjs/toolkit';
import {ShoppingListState} from './types';
import {createOrUpdateItem, fetchListInfo} from './asyncThunks';
import {ListInfo, UIShoppingListItem} from '../types';

export const fetchListInfoReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(
    fetchListInfo.fulfilled,
    (state: ShoppingListState, action: PayloadAction<ListInfo>) => {
      const listInfo = action.payload;
      state.headerInfo.listName = listInfo.listName;
      state.items = listInfo.shoppingListItems;
    },
  );
};

export const createOrUpdateItemReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(
    createOrUpdateItem.fulfilled,
    (state: ShoppingListState, action: PayloadAction<UIShoppingListItem>) => {
      state.items = state.items.concat(action.payload);
    },
  );
};
