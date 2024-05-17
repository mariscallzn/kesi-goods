import {createSelector} from '@reduxjs/toolkit';
import {selectRootState} from '../../../redux/store';

export const bottomSheetSelector = createSelector(
  selectRootState,
  state => state.stores.bottomSheet,
);

export const snackbarSelector = createSelector(
  selectRootState,
  state => state.stores.snackbar,
);

export const multiSelectionSelector = createSelector(
  selectRootState,
  state => state.stores.multiSelection,
);
