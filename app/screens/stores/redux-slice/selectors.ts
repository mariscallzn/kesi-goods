import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../../../redux/store';

//#region Selectors
const selectRootState = (rootState: RootState) => rootState;

export const bottomSheetSelector = createSelector(
  selectRootState,
  state => state.stores.bottomSheet,
);
//#endregion
