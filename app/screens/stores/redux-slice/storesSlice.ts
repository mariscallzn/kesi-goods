import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {UnknownMetadata} from '../../../utils/types';
import {
  createOrUpdateStoreReducer,
  fetchStoresReducer,
  openAsyncBottomSheetReducer,
} from './reducers';
import {StoresState, initialState} from './types';

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
    openAsyncBottomSheetReducer(builder);
  },
});

export const {hideBottomSheet, openBottomSheet} = storesSlice.actions;

export default storesSlice.reducer;
