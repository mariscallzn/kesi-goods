import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {appComponent} from '@/di/appComponent';
import {UnknownMetadata} from '@/utils/types';
import {UIStore} from '../types';
import {
  CopyListThunkArgs,
  MultiSelectionArgs,
  StoresState,
  initialState,
} from './types';
import {KUser, Store} from '@/model/types';

//#region Slice
const storesSlice = createSlice({
  name: 'stores',
  initialState: initialState,
  reducers: {
    /**
     * This reducer is to hide the bottom sheet
     * @param state {@link StoresState}
     */
    hideBottomSheet: (state: StoresState) => {
      state.bottomSheet.isVisible = false;
    },
    /**
     * This reducer it's to open the bottom sheet that does not require to fetch data
     * asynchronously
     * @param state {@link StoresState}
     * @param action {@link PayloadAction} of {@link UnknownMetadata}
     */
    openBottomSheet: (
      state: StoresState,
      action: PayloadAction<UnknownMetadata>,
    ) => {
      state.bottomSheet.isVisible = true;
      state.bottomSheet.metadata = action.payload;
    },
    dismissSnackbar: (state: StoresState) => {
      state.snackbar.visible = false;
      state.snackbar.metadata = {type: '', value: undefined};
    },
    toggleMultiSelection: (
      state: StoresState,
      action: PayloadAction<boolean>,
    ) => {
      state.multiSelection.isEnabled = action.payload;
      state.stores = state.stores.map(e => ({
        ...e,
        multiSelectionEnabled: action.payload,
      }));

      if (!action.payload) {
        state.multiSelection.selectedItems = [];
      }
    },
    addOrRemoveSelection: (
      state: StoresState,
      action: PayloadAction<MultiSelectionArgs>,
    ) => {
      let updatedList = state.multiSelection.selectedItems;
      if (action.payload.addOrRemove === 'add') {
        updatedList.push(action.payload.store);
      } else {
        updatedList = updatedList.filter(c => c.id !== action.payload.store.id);
      }
      state.multiSelection.selectedItems = updatedList;
    },
  },
  extraReducers: builder => {
    syncUpReducer(builder);
    createOrUpdateStoreReducer(builder);
    copyListReducer(builder);
    markStoreListAsDeleteReducer(builder);
    restoreStoreListReducer(builder);
    createSharedLinkReducer(builder);
  },
});
//#endregion

//#region Sync up
export const syncUp = createAsyncThunk<
  {user: KUser | undefined; stores: UIStore[]},
  void
>('stores/syncUp', async (_, {rejectWithValue}) => {
  try {
    const {user, stores} = await appComponent.storesService().syncUp();
    return {user: user, stores: stores};
  } catch (error) {
    return rejectWithValue(error);
  }
});

const syncUpReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  // builder.addCase(syncUp.pending, (state: StoresState) => {
  // TODO: I have to show that I'm syncing the lists
  //});
  builder.addCase(syncUp.fulfilled, (state: StoresState, action) => {
    state.stores = action.payload.stores;
    state.user = action.payload.user;
  });
  builder.addCase(syncUp.rejected, (_: StoresState, action) => {
    console.log(action.error);
  });
};
//#endregion

//#region Create or Update
export const createOrUpdateStore = createAsyncThunk<void, Store>(
  'stores/createOrUpdateStores',
  async (store: Store, {rejectWithValue, dispatch}) => {
    try {
      await appComponent.storesService().createOrUpdate(store);
      dispatch(syncUp());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const createOrUpdateStoreReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  // builder.addCase(createOrUpdateStore.pending, (state: StoresState) => {});
  builder.addCase(createOrUpdateStore.fulfilled, (state: StoresState) => {
    state.bottomSheet.isVisible = false;
    state.bottomSheet.metadata = undefined;
  });
  // builder.addCase(createOrUpdateStore.rejected, (state: StoresState) => {});
};
//#endregion

//#region Copy list
export const copyList = createAsyncThunk<void, CopyListThunkArgs>(
  'stores/copyList',
  async (args, {rejectWithValue, dispatch}) => {
    try {
      await appComponent
        .storesService()
        .copyStoreList(args.stores, args.copyOption);
      dispatch(syncUp());
      dispatch(toggleMultiSelection(false));
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const copyListReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  builder.addCase(copyList.fulfilled, () => {});
};
//#endregion

//#region Mark as delete store list
export const markStoreListAsDelete = createAsyncThunk<Store[], Store[]>(
  'stores/markStoreListAsDelete',
  async (stores, {rejectWithValue, dispatch}) => {
    try {
      const result = await appComponent
        .storesService()
        .markStoreListAsDelete(stores);
      dispatch(syncUp());
      dispatch(toggleMultiSelection(false));
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const markStoreListAsDeleteReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  builder.addCase(
    markStoreListAsDelete.fulfilled,
    (state: StoresState, action: PayloadAction<Store[]>) => {
      state.snackbar.visible = true;
      state.snackbar.metadata = {
        type: 'snackbar',
        value: action.payload,
      };
    },
  );
};
//#endregion

//#region Restore store list
export const restoreStoreList = createAsyncThunk<Store[], Store[]>(
  'stores/restoreStoreList',
  async (stores: Store[], {rejectWithValue, dispatch}) => {
    try {
      const _stores = await appComponent
        .storesService()
        .restoreStoreList(stores);
      dispatch(syncUp());
      return _stores;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const restoreStoreListReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  builder.addCase(restoreStoreList.fulfilled, () => {});
};
//#endregion

//#region Create shared link
export const createSharedLink = createAsyncThunk<
  {store: Store; button: string},
  {store: Store; button: string}
>('stores/createSharedLink', async (args, {rejectWithValue}) => {
  try {
    return new Promise((r, _) =>
      setTimeout(
        () =>
          r({
            button: args.button,
            store: {...args.store, cloudId: '9009asd09u09j0a9i'},
          }),
        1500,
      ),
    );
  } catch (error) {
    return rejectWithValue(error);
  }
});

const createSharedLinkReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  builder.addCase(
    createSharedLink.fulfilled,
    (
      state: StoresState,
      action: PayloadAction<{store: Store; button: string}>,
    ) => {
      state.bottomSheet.metadata = {
        ...state.bottomSheet.metadata,
        value: action.payload,
      } as UnknownMetadata;
    },
  );
  // builder.addCase(createSharedLink.rejected, (state: StoresState) => {});
};
//#endregion

export const {
  hideBottomSheet,
  openBottomSheet,
  dismissSnackbar,
  toggleMultiSelection,
  addOrRemoveSelection,
} = storesSlice.actions;

export default storesSlice.reducer;
