import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  CreateOrUpdateItemArgs,
  ShoppingListState,
  ThunkResult,
  ThunkToggleItems,
  ToggleItemArgs,
  ToggledItem,
  initialState,
} from './types';
import {UnknownMetadata} from '../../../utils/types';
import {
  AddOrUpdateBSMetadata,
  bottomSheetTypes,
} from '../components/bottom-sheet-coordinator/types';
import {ListInfo} from '../types';
import {appComponent} from '../../../di/appComponent';
import {fetchStores} from '../../stores/redux-slice/asyncThunks';
import {AppDispatch} from '../../../redux/store';
import {debounce} from 'lodash';

//#region Slice
const shoppingListSlice = createSlice({
  name: 'shopping',
  initialState: initialState,
  reducers: {
    hideBottomSheet: (state: ShoppingListState) => {
      state.bottomSheet.isVisible = false;
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
  },
});
//#endregion

//#region Fetch ListInfo
export const fetchListInfo = createAsyncThunk<ListInfo, string>(
  'shopping/fetchListInfo',
  async (listId: string, {rejectWithValue}) => {
    try {
      return await appComponent
        .shoppingListService()
        .getShoppingListByStore(listId);
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
  CreateOrUpdateItemArgs
>('shopping/createOrUpdateItem', async (args, {rejectWithValue, dispatch}) => {
  try {
    await appComponent
      .shoppingListService()
      .createOrUpdateShoppingListItem(args.listId, args.shoppingListItem);
    dispatch(fetchListInfo(args.listId));
    dispatch(fetchStores());
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createOrUpdateItemReducer = (
  builder: ActionReducerMapBuilder<ShoppingListState>,
) => {
  builder.addCase(createOrUpdateItem.fulfilled, (state: ShoppingListState) => {
    console.log(state.headerInfo.listName);
  });
};
//#endregion

//#region Toggle Item
export const toggleItem = createAsyncThunk<void, ToggleItemArgs>(
  'shopping/toggleItem',
  async (args: ToggleItemArgs, {rejectWithValue, dispatch}) => {
    try {
      for (const interaction of args.interactions) {
        await appComponent
          .shoppingListService()
          .toggleShoppingListItemById(interaction.itemId, interaction.checked);
      }
      dispatch(fetchListInfo(args.listId));
      dispatch(fetchStores());
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

//#region Exports
export const {hideBottomSheet, openBottomSheet, recordToggleInteraction} =
  shoppingListSlice.actions;
export default shoppingListSlice.reducer;
//#endregion
