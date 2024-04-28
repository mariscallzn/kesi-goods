import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {Store} from './model/storesRepository';
import {appComponent} from '../../di/appComponent';

interface StoresState {
  stores: Store[];
}

const initialState: StoresState = {
  stores: [],
};

const storesSlice = createSlice({
  name: 'stores',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    fetchStoresReducer(builder);
    createOrUpdateStoreReducer(builder);
  },
});

//#region Extra reducers Cases
const fetchStoresReducer = (builder: ActionReducerMapBuilder<StoresState>) => {
  builder.addCase(fetchStores.pending, (state: StoresState) => {});
  builder.addCase(
    fetchStores.fulfilled,
    (state: StoresState, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
  );
  builder.addCase(fetchStores.rejected, (state: StoresState) => {});
};

const createOrUpdateStoreReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  builder.addCase(createOrUpdateStore.pending, (state: StoresState) => {});
  builder.addCase(
    createOrUpdateStore.fulfilled,
    (state: StoresState, action: PayloadAction<Store>) => {
      state.stores = state.stores.concat(action.payload);
    },
  );
  builder.addCase(createOrUpdateStore.rejected, (state: StoresState) => {});
};
//#endregion

//#region Thunks
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (_, {rejectWithValue}) => {
    try {
      return await appComponent.storesRepository().fetch();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createOrUpdateStore = createAsyncThunk(
  'stores/createOrUpdateStores',
  async (store: Store, {rejectWithValue}) => {
    try {
      return await appComponent.storesRepository().addOrUpdate(store);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//#endregion

export default storesSlice.reducer;
