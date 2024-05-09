import {createAsyncThunk} from '@reduxjs/toolkit';
import {ListInfo, UIShoppingListItem} from '../types';
import {appComponent} from '../../../di/appComponent';
import {CreateOrUpdateItemArgs} from './types';
import {fetchStores} from '../../stores/redux-slice/asyncThunks';

export const fetchListInfo = createAsyncThunk<ListInfo, string>(
  'shopping/fetchListInfo',
  async (listId: string, {rejectWithValue}) => {
    try {
      return await appComponent
        .shoppingListService()
        .getShoppingListByStore(listId);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createOrUpdateItem = createAsyncThunk<
  UIShoppingListItem,
  CreateOrUpdateItemArgs
>('shopping/createOrUpdateItem', async (args, {rejectWithValue, dispatch}) => {
  try {
    const result = await appComponent
      .shoppingListService()
      .createOrUpdateShoppingListItem(args.listId, args.shoppingListItem);
    dispatch(fetchStores());
    return result;
  } catch (error) {
    return rejectWithValue(error);
  }
});
