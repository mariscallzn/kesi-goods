import {createSelector} from '@reduxjs/toolkit';
import {selectRootState} from '../../../redux/store';

export const bottomSheetSelector = createSelector(
  selectRootState,
  state => state.stores.bottomSheet,
);

export const footerSelector = createSelector(
  selectRootState,
  state => state.stores.footer,
);
