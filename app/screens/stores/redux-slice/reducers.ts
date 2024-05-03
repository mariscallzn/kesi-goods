import {ActionReducerMapBuilder, PayloadAction} from '@reduxjs/toolkit';
import {StoresState} from './types';
import {
  createOrUpdateStore,
  fetchStores,
  openAsyncBottomSheet,
} from './asyncThunks';
import {UIStore} from '../types';
import {UnknownMetadata} from '../../../utils/types';

export const fetchStoresReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  // builder.addCase(fetchStores.pending, (state: StoresState) => {});
  builder.addCase(
    fetchStores.fulfilled,
    (state: StoresState, action: PayloadAction<UIStore[]>) => {
      state.stores = action.payload;
    },
  );
  // builder.addCase(fetchStores.rejected, (state: StoresState) => {});
};

export const createOrUpdateStoreReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  // builder.addCase(createOrUpdateStore.pending, (state: StoresState) => {});
  builder.addCase(
    createOrUpdateStore.fulfilled,
    (state: StoresState, action: PayloadAction<UIStore>) => {
      state.stores = state.stores.concat(action.payload);
      state.bottomSheet.isVisible = false;
      state.bottomSheet.metadata = undefined;
    },
  );
  // builder.addCase(createOrUpdateStore.rejected, (state: StoresState) => {});
};

export const openAsyncBottomSheetReducer = (
  builder: ActionReducerMapBuilder<StoresState>,
) => {
  builder.addCase(openAsyncBottomSheet.pending, (state: StoresState) => {
    state.bottomSheet.isVisible = true;
    state.bottomSheet.isLoading = true;
  });
  builder.addCase(
    openAsyncBottomSheet.fulfilled,
    (state: StoresState, action: PayloadAction<UnknownMetadata>) => {
      state.bottomSheet.isLoading = false;
      state.bottomSheet.metadata = action.payload;
    },
  );
};
