import {createSelector} from '@reduxjs/toolkit';
import {selectRootState} from '../../../redux/store';

export const headerInfoSelector = createSelector(
  selectRootState,
  state => state.products.headerInfo,
);

export const productsSelector = createSelector(
  selectRootState,
  state => state.products.items,
);

export const goBackSelector = createSelector(
  selectRootState,
  state => state.products.goBack,
);
