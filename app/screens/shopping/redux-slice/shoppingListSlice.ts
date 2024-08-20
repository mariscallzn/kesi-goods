import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {debounce} from 'lodash';
import {appComponent} from '../../../di/appComponent';
import {translate} from '../../../i18n/translate';
import {ShoppingListItem} from '../../../model/types';
import {AppDispatch, RootState, ThunkResult} from '../../../redux/store';
import {UnknownMetadata} from '../../../utils/types';
import {syncUp} from '../../stores/redux-slice/storesSlice';
import {
  AddOrUpdateBSMetadata,
  bottomSheetTypes,
} from '../components/bottom-sheet-coordinator/types';
import {ListInfo, RESTORE_TYPE} from '../types';
import {
  FetchListInfoArgs,
  ListIdShoppingItemArgs,
  RestoreShoppingListArgs,
  ShoppingListState,
  ThunkToggleItems,
  ToggleItemArgs,
  ToggledItem,
  initialState,
} from './types';

//#region Slice
const shoppingListSlice = createSlice({
  name: 'shopping',
  initialState: initialState,
  reducers: {
    resetState: () => initialState,
    toggleSearch: (
      state: ShoppingListState,
      action: PayloadAction<boolean>,
    ) => {
      state.headerInfo.searchEnabled = action.payload;
      state.headerInfo.searchTerm = undefined;
    },
    hideBottomSheet: (state: ShoppingListState) => {
      state.bottomSheet.isVisible = false;
    },
    reloadBottomSheet: (
      state: ShoppingListState,
      action: PayloadAction<UnknownMetadata>,
    ) => {
      state.bottomSheet.isVisible = true;
      state.bottomSheet.metadata = action.payload;
    },
    dismissSnackbar: (state: ShoppingListState) => {
      state.snackbar.visible = false;
      state.snackbar.metadata = {type: '', value: undefined};
    },
    setSearchTerm: (
      state: ShoppingListState,
      action: PayloadAction<string>,
    ) => {
      state.headerInfo.searchTerm = action.payload;
    },
    openBottomSheet: (
      state: ShoppingListState,
      action: PayloadAction<UnknownMetadata>,
    ) => {
      state.bottomSheet.isVisible = true;
      switch (action.payload.type) {
        case bottomSheetTypes.addOrUpdateItem:
          state.bottomSheet.metadata = {
            ...action.payload,
            value: {
              ...(action.payload.value as AddOrUpdateBSMetadata),
              //TODO: We should read some setting to know which metric system to load
              units: ['gal', 'oz', 'lb', 'pkg'],
            } as AddOrUpdateBSMetadata,
          };
          break;
        default:
          state.bottomSheet.metadata = {
            type: action.payload.type,
            value: action.payload.value,
          };
          break;
      }
    },
    recordToggleInteraction: (
      state: ShoppingListState,
      action: PayloadAction<ToggledItem>,
    ) => {
      //TODO: For better performance, remove duplicates
      state.toggleItemInteractions = state.toggleItemInteractions.concat(
        action.payload,
      );
    },
  },
  extraReducers: builder => {
    fetchListInfoReducer(builder);
    createOrUpdateItemReducer(builder);
    toggleItemReducer(builder);
    uncheckAllListItemsReducer(builder);
    restoreShoppingListReducer(builder);
    deleteShoppingListReducer(builder);
    deleteShoppingListItemReducer(builder);
  },
});
//#endregion

//#region Fetch ListInfo
export const fetchListInfo = createAsyncThunk<ListInfo, FetchListInfoArgs>(
  'shopping/fetchListInfo',
  async (args, {rejectWithValue}) => {
    try {
      //TODO: Fetch cloud or DB
      return await appComponent
        .shoppingListService()
        .getShoppingListByStore(args.listId, args.searchTerm);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchListInfoReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(
    fetchListInfo.fulfilled,
    (state: ShoppingListState, action: PayloadAction<ListInfo>) => {
      const listInfo = action.payload;
      state.headerInfo.listName = listInfo.listName;
      state.headerInfo.progress = listInfo.progress;
      state.items = listInfo.shoppingListItems;
      state.toggleItemInteractions = [];
    },
  );
};
//#endregion

//#region Create or Update Item
export const createOrUpdateItem = createAsyncThunk<
  void,
  ListIdShoppingItemArgs
>(
  'shopping/createOrUpdateItem',
  async (args, {rejectWithValue, dispatch, getState}) => {
    try {
      const state = (getState() as RootState).shopping;
      await appComponent
        .shoppingListService()
        .createOrUpdateShoppingListItem(args.listId, args.shoppingListItem);
      dispatch(
        fetchListInfo({
          listId: args.listId,
          searchTerm: state.headerInfo.searchTerm,
        }),
      );
      dispatch(syncUp());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createOrUpdateItemReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(createOrUpdateItem.fulfilled, (_: ShoppingListState) => {});
};
//#endregion

//#region Toggle Item
const toggleItem = createAsyncThunk<void, ToggleItemArgs>(
  'shopping/toggleItem',
  async (args: ToggleItemArgs, {rejectWithValue, dispatch, getState}) => {
    try {
      const state = (getState() as RootState).shopping;
      for (const interaction of args.interactions) {
        await appComponent
          .shoppingListService()
          .toggleShoppingListItemById(interaction.itemId, interaction.checked);
      }
      dispatch(
        fetchListInfo({
          listId: args.listId,
          searchTerm: state.headerInfo.searchTerm,
        }),
      );
      dispatch(syncUp());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const debounceToggleItemExecution = debounce(
  (dispatch: AppDispatch, interactions: ToggledItem[], listId: string) => {
    dispatch(toggleItem({interactions: interactions, listId: listId}));
  },
  2000,
);

export const handleToggle =
  (args: ThunkToggleItems): ThunkResult<void> =>
  (dispatch, getState) => {
    dispatch(recordToggleInteraction(args.interaction));
    const interactions = getState().shopping.toggleItemInteractions;
    debounceToggleItemExecution(dispatch, interactions, args.listId);
  };

export const toggleItemReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(toggleItem.fulfilled, () => {});
};
//#endregion

//#region Search
const debounceSearch = debounce(
  (dispatch: AppDispatch, searchTerm: string, listId: string) => {
    dispatch(fetchListInfo({listId: listId, searchTerm: searchTerm}));
  },
  150,
);

export const search =
  (args: {term: string; listId: string}): ThunkResult<void> =>
  dispatch => {
    dispatch(setSearchTerm(args.term));
    debounceSearch(dispatch, args.term, args.listId);
  };
//#endregion

//#region Uncheck all items
export const uncheckAllListItems = createAsyncThunk<ShoppingListItem[], string>(
  'shopping/uncheckAllListItems',
  async (storeId, {rejectWithValue, dispatch}) => {
    try {
      const items = await appComponent
        .shoppingListService()
        .uncheckAllListItems(storeId);
      dispatch(fetchListInfo({listId: storeId}));
      dispatch(syncUp());
      return items;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const uncheckAllListItemsReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(
    uncheckAllListItems.fulfilled,
    (state: ShoppingListState, action: PayloadAction<ShoppingListItem[]>) => {
      state.snackbar.visible = true;
      state.snackbar.message = translate(
        'ShoppingListScreen.Snackbar.allItemsUnchecked',
      );
      state.snackbar.metadata = {
        type: RESTORE_TYPE.restoreUnchecked,
        value: action.payload,
      };
    },
  );
};
//#endregion

//#region Mark as delete shopping list item
export const deleteShoppingListItem = createAsyncThunk<
  ShoppingListItem[],
  ListIdShoppingItemArgs
>(
  'shopping/deleteShoppingListItem',
  async (args, {rejectWithValue, dispatch}) => {
    try {
      const updatedItem = await appComponent
        .shoppingListService()
        .markShoppingListItemAsDeleted(args.shoppingListItem);
      dispatch(fetchListInfo({listId: args.listId}));
      dispatch(syncUp());
      return [updatedItem];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const deleteShoppingListItemReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(
    deleteShoppingListItem.fulfilled,
    (state: ShoppingListState, action: PayloadAction<ShoppingListItem[]>) => {
      state.snackbar.visible = true;
      state.snackbar.message = translate(
        'ShoppingListScreen.Snackbar.itemRemoved',
      );
      state.snackbar.metadata = {
        type: RESTORE_TYPE.restoreDeleted,
        value: action.payload,
      };
    },
  );
};
//#endregion

//#region Mark as delete checked items
export const deleteCheckedItems = createAsyncThunk<ShoppingListItem[], string>(
  'shopping/deleteCheckedItems',
  async (storeId, {rejectWithValue, dispatch}) => {
    try {
      const items = await appComponent
        .shoppingListService()
        .markCheckedItemsAsDeleted(storeId);
      dispatch(fetchListInfo({listId: storeId}));
      dispatch(syncUp());
      return items;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const deleteShoppingListReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(
    deleteCheckedItems.fulfilled,
    (state: ShoppingListState, action: PayloadAction<ShoppingListItem[]>) => {
      state.snackbar.visible = true;
      state.snackbar.message =
        action.payload.length > 1
          ? translate('ShoppingListScreen.Snackbar.checkedItemsRemoved')
          : translate('ShoppingListScreen.Snackbar.itemRemoved');
      state.snackbar.metadata = {
        type: RESTORE_TYPE.restoreDeleted,
        value: action.payload,
      };
    },
  );
};
//#endregion

//#region Restore shopping list
export const restoreShoppingList = createAsyncThunk<
  void,
  RestoreShoppingListArgs
>('shopping/restoreShoppingList', async (args, {rejectWithValue, dispatch}) => {
  try {
    await appComponent.shoppingListService().restoreShoppingList(args.metadata);
    dispatch(fetchListInfo({listId: args.listId}));
    dispatch(syncUp());
  } catch (error) {
    return rejectWithValue(error);
  }
});

const restoreShoppingListReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(restoreShoppingList.fulfilled, () => {});
};
//#endregion

//#region Exports
export const {
  resetState,
  reloadBottomSheet,
  hideBottomSheet,
  openBottomSheet,
  recordToggleInteraction,
  toggleSearch,
  dismissSnackbar,
  setSearchTerm,
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
//#endregion
