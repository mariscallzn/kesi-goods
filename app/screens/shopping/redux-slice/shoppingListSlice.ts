import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {createOrUpdateItemReducer, fetchListInfoReducer} from './reducers';
import {ShoppingListState, initialState} from './types';
import {UnknownMetadata} from '../../../utils/types';
import {
  AddOrUpdateBSMetadata,
  bottomSheetTypes,
} from '../components/bottom-sheet-coordinator/types';

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
  },
  extraReducers: builder => {
    fetchListInfoReducer(builder);
    createOrUpdateItemReducer(builder);
  },
});

export const {hideBottomSheet, openBottomSheet} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
