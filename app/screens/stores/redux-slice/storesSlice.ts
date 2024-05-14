import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {appComponent} from '../../../di/appComponent';
import {UnknownMetadata} from '../../../utils/types';
import {UIStore} from '../types';
import {CopyListThunkArgs, StoresState, initialState} from './types';
import {Store} from '../../../model/types';

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
  },
  extraReducers: builder => {
    fetchStoresReducer(builder);
    createOrUpdateStoreReducer(builder);
    copyListReducer(builder);
  },
});
//#endregion

//#region Fetch Stores
export const fetchStores = createAsyncThunk<UIStore[], void>(
  'stores/fetchStores',
  async (_, {rejectWithValue}) => {
    try {
      return await appComponent.storesService().getStores();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const fetchStoresReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  // builder.addCase(fetchStores.pending, (state: StoresState) => {});
  builder.addCase(
    fetchStores.fulfilled,
    (state: StoresState, action: PayloadAction<UIStore[]>) => {
      state.stores = action.payload;
    },
  );
  // builder.addCase(fetchStores.rejected, (state: StoresState) => {});
};
//#endregion

//#region Create or Update
export const createOrUpdateStore = createAsyncThunk<void, Store>(
  'stores/createOrUpdateStores',
  async (store: Store, {rejectWithValue, dispatch}) => {
    try {
      await appComponent.storesService().createOrUpdate(store);
      dispatch(fetchStores());
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
        .copyStoreList(args.store, args.copyOption);
      dispatch(fetchStores());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const copyListReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  builder.addCase(copyList.fulfilled, () => {});
};
//#endregion
export const {hideBottomSheet, openBottomSheet} = storesSlice.actions;

export default storesSlice.reducer;
