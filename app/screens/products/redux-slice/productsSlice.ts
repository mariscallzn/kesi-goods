import {
  ActionReducerMapBuilder,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {debounce} from 'lodash';
import {appComponent} from '../../../di/appComponent';
import {AppDispatch, RootState, ThunkResult} from '../../../redux/store';
import {
  InitData,
  ListIdSearchTermArgs,
  ProductsState,
  UserActionArgs,
  initialState,
} from './types';
import {
  fetchListInfo,
  syncUpShoppingList,
} from '../../shopping/redux-slice/shoppingListSlice';
import {fetchLocalData} from '../../stores/redux-slice/storesSlice';
import {IView} from '../components/content/types';

//#region Slice
const productsSlice = createSlice({
  name: 'products',
  initialState: initialState,
  reducers: {
    resetState: () => initialState,
    setSearchTerm: (state: ProductsState, action: PayloadAction<string>) => {
      state.headerInfo.searchTerm = action.payload;
    },
  },
  extraReducers: builder => {
    initializeReducer(builder);
    fetchProductsReducer(builder);
    draftChangeReducer(builder);
    addSelectionReducer(builder);
    cleanUpReducer(builder);
  },
});
//#endregion

//#region Initialize
export const initialize = createAsyncThunk<InitData, string>(
  'products/initialize',
  async (listId, {rejectWithValue}) => {
    try {
      return await appComponent.productService().init(listId);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
const initializeReducer = (builder: ActionReducerMapBuilder<ProductsState>) => {
  builder.addCase(
    initialize.fulfilled,
    (state: ProductsState, action: PayloadAction<InitData>) => {
      state.items = action.payload.items;
      state.snapshot = action.payload.snapshot;
    },
  );
};
//#endregion

//#region Fetch products
export const fetchProducts = createAsyncThunk<IView[], ListIdSearchTermArgs>(
  'products/fetchProducts',
  async (args, {rejectWithValue}) => {
    try {
      return await appComponent
        .productService()
        .fetchProducts(args.listId, args.term);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const fetchProductsReducer = (
  builder: ActionReducerMapBuilder<ProductsState>,
) => {
  builder.addCase(
    fetchProducts.fulfilled,
    (state: ProductsState, action: PayloadAction<IView[]>) => {
      state.items = action.payload;
    },
  );
};
//#endregion

//#region Search
const debounceSearch = debounce(
  (dispatch: AppDispatch, args: ListIdSearchTermArgs) => {
    dispatch(fetchProducts(args));
  },
  150,
);

export const search =
  (args: ListIdSearchTermArgs): ThunkResult<void> =>
  dispatch => {
    dispatch(setSearchTerm(args.term ?? ''));
    debounceSearch(dispatch, args);
  };
//#endregion

//#region Draft change
const debounceDraft = debounce(
  (dispatch: AppDispatch, args: UserActionArgs) => {
    dispatch(_draftChange(args));
  },
  250,
);

export const draftChange =
  (args: UserActionArgs): ThunkResult<void> =>
  dispatch => {
    debounceDraft(dispatch, args);
  };

const _draftChange = createAsyncThunk<IView[], UserActionArgs>(
  'products/draftChange',
  async (args, {rejectWithValue, getState}) => {
    try {
      const state = (getState() as RootState).products;
      return await appComponent
        .productService()
        .updateItemsByAction(
          args.listId,
          state.snapshot,
          args.action,
          state.items,
        );
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const draftChangeReducer = (
  builder: ActionReducerMapBuilder<ProductsState>,
) => {
  builder.addCase(
    _draftChange.fulfilled,
    (state: ProductsState, action: PayloadAction<IView[]>) => {
      state.items = action.payload;
    },
  );
};
//#endregion

//#region Add selection
export const addSelection = createAsyncThunk<
  void,
  {listId: string; listCloudId?: string}
>('products/addSelection', async (args, {rejectWithValue, dispatch}) => {
  try {
    await appComponent.productService().addSelection(args.listId);
    dispatch(fetchListInfo({listId: args.listId}));
    dispatch(syncUpShoppingList(args.listId));
    dispatch(fetchLocalData());
  } catch (error) {
    return rejectWithValue(error);
  }
});
const addSelectionReducer = (
  builder: ActionReducerMapBuilder<ProductsState>,
) => {
  builder.addCase(addSelection.fulfilled, (state: ProductsState) => {
    state.goBack = true;
  });
};
//#endregion

//#region Clean up
export const cleanUp = createAsyncThunk<void, string>(
  'products/cleanUp',
  async (listId, {rejectWithValue, getState, dispatch}) => {
    try {
      const state = (getState() as RootState).products;
      await appComponent
        .productService()
        .deleteDraftItemsByList(listId, state.snapshot);
      dispatch(resetState());
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
const cleanUpReducer = (builder: ActionReducerMapBuilder<ProductsState>) => {
  builder.addCase(cleanUp.fulfilled, () => {});
};
//#endregion

//#region Exports
export default productsSlice.reducer;
export const {resetState, setSearchTerm} = productsSlice.actions;
//#endregion
