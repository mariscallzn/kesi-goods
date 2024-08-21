import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {AddStoreState, initialState} from './types';
import {Store} from '../../../model/types';
import {appComponent} from '../../../di/appComponent';
import {fetchLocalData} from '../../stores/redux-slice/storesSlice';

//#region Slice
const addStoreSlice = createSlice({
  name: 'addStores',
  initialState: initialState,
  reducers: {
    resetState: () => initialState,
    fetchSuggestions: (state: AddStoreState) => {
      state.suggestions = appComponent.addStoreService().fetchSuggestions();
    },
  },
  extraReducers: builder => {
    createListReducer(builder);
  },
});
//#endregion

//#region Create List
export const createList = createAsyncThunk<void, Store>(
  'addStores/createList',
  async (store: Store, {rejectWithValue, dispatch}) => {
    try {
      await appComponent.storesService().createOrUpdate(store);
      dispatch(fetchLocalData());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const createListReducer = (builder: ActionReducerMapBuilder<AddStoreState>) => {
  builder.addCase(createList.fulfilled, (state: AddStoreState) => {
    state.goBack = true;
  });
};
//#endregion

//#region Exports
export const {resetState, fetchSuggestions} = addStoreSlice.actions;
export default addStoreSlice.reducer;
//#endregion
