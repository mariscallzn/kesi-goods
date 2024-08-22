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
  InitRequest,
  MultiSelectionArgs,
  StoresState,
  initSequence,
  initialState,
} from './types';
import {KUser, Store, StoreUser} from '@/model/types';
import {replace} from '@/utils/misc';
import {ShareLinkMetadata} from '../components/bottom-sheet-coordinator/share-link/types';

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
      state.bottomSheet.metadata = {
        type: action.payload.type,
        //@ts-ignore
        value: {...action.payload.value, user: state.user},
      };
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
    getUserReducer(builder);
    fetchLocalDataReducer(builder);
    backupListReducer(builder);
  },
});
//#endregion

//#region Init
export const init = createAsyncThunk<void, InitRequest[]>(
  'stores/init',
  (args, {dispatch}) => {
    const sequenceMap: Record<InitRequest, () => void> = {
      'fetch-local': () => dispatch(fetchLocalData()),
      'fetch-cloud': () => dispatch(syncUp()),
      'get-user': () => dispatch(getUser()),
    };

    args.forEach(sequence => {
      const i = initSequence.indexOf(sequence);
      sequenceMap[initSequence[i]]();
    });
  },
);
//#endregion

//#region Get user
const getUser = createAsyncThunk<KUser | undefined, void>(
  'store/getUser',
  async (_, {rejectWithValue}) => {
    try {
      return await appComponent.storesService().getUser();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const getUserReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  // builder.addCase(getUser.pending, (state) => {});
  builder.addCase(getUser.fulfilled, (state, action) => {
    state.user = action.payload;
  });
  // builder.addCase(getUser.rejected, () => {});
};
//#endregion

//#region Backup list
export const backupList = createAsyncThunk<UIStore, StoreUser>(
  'store/backupList',
  async (args, {rejectWithValue}) => {
    try {
      return appComponent.storesService().backupList(args);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const backupListReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  builder.addCase(backupList.pending, () => {});
  builder.addCase(backupList.fulfilled, (state, action) => {
    state.stores = replace(
      state.stores,
      item => item.store.id === action.payload.store.id,
      action.payload,
    );
  });
  builder.addCase(backupList.rejected, () => {});
};
//#region

//#region Fetch local data
export const fetchLocalData = createAsyncThunk<UIStore[], void>(
  'store/fetchLocalData',
  async (_, {rejectWithValue}) => {
    try {
      return await appComponent.storesService().fetchStores();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const fetchLocalDataReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  // builder.addCase(fetchLocalData.pending, () => {});
  builder.addCase(fetchLocalData.fulfilled, (state, action) => {
    state.stores = action.payload;
  });
  // builder.addCase(fetchLocalData.rejected, () => {});
};
//#endregion

//#region Sync up
const syncUp = createAsyncThunk<UIStore[], void>(
  'stores/syncUp',
  async (_, {rejectWithValue}) => {
    try {
      return await appComponent.storesService().syncUp();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const syncUpReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  // builder.addCase(syncUp.pending, (state: StoresState) => {
  // TODO: I have to show that I'm syncing the lists
  //});
  builder.addCase(syncUp.fulfilled, (state: StoresState, action) => {
    state.stores = action.payload;
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
      dispatch(fetchLocalData());
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
      dispatch(fetchLocalData());
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
      dispatch(fetchLocalData());
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
      dispatch(fetchLocalData());
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
  {uiStore: UIStore; button: string},
  {store: Store; button: string}
>('stores/createSharedLink', async (args, {rejectWithValue}) => {
  try {
    return {
      button: args.button,
      uiStore: await appComponent.storesService().backupList(args.store),
    };
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
      action: PayloadAction<{uiStore: UIStore; button: string}>,
    ) => {
      state.bottomSheet.metadata = {
        ...state.bottomSheet.metadata,
        value: {
          button: action.payload.button,
          store: action.payload.uiStore.store,
        } as ShareLinkMetadata,
      } as UnknownMetadata;

      state.stores = replace(
        state.stores,
        item => item.store.id === action.payload.uiStore.store.id,
        action.payload.uiStore,
      );
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
