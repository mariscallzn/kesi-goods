import {createSelector} from '@reduxjs/toolkit';
import {selectRootState} from '../../../redux/store';

export const headerInfoSelector = createSelector(
  selectRootState,
  state => state.shopping.headerInfo,
);

export const bottomSheetSelector = createSelector(
  selectRootState,
  state => state.shopping.bottomSheet,
);
