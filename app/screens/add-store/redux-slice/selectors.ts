import {createSelector} from '@reduxjs/toolkit';
import {selectRootState} from '../../../redux/store';

export const suggestionSelector = createSelector(
  selectRootState,
  state => state.addStores.suggestions,
);

export const goBackSelector = createSelector(
  selectRootState,
  state => state.addStores.goBack,
);
