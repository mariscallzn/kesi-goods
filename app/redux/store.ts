import {ThunkAction, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import storesReducer from '../screens/stores/redux-slice/storesSlice';
import shoppingListReducer from '../screens/shopping/redux-slice/shoppingListSlice';
import productsReducer from '../screens/products/redux-slice/productsSlice';
import addStoreReducer from '../screens/add-store/redux-slice/addStoreSlice';

//#region Redux STORE
export const store = configureStore({
  reducer: {
    stores: storesReducer,
    addStores: addStoreReducer,
    shopping: shoppingListReducer,
    products: productsReducer,
  },
});
//#endregion

//#region Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//#endregion

//#region Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
//#endregion

export const selectRootState = (rootState: RootState) => rootState;
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>;
