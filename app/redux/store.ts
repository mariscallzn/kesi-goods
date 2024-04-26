import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import storesListReducer from '../screens/stores/storesListSlice';
import shoppingListReducer from '../screens/shopping/shoppingListSlice';
import productsReducer from '../screens/products/productsSlice';

//#region Redux STORE
export const store = configureStore({
  reducer: {
    stores: storesListReducer,
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
