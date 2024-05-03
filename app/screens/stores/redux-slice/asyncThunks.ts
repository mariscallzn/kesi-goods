import {createAsyncThunk} from '@reduxjs/toolkit';
import {appComponent} from '../../../di/appComponent';
import {Store} from '../../../model/types';
import {UnknownMetadata} from '../../../utils/types';
import {bottomSheetTypes} from '../components/bottom-sheet-coordinator/types';
import {UIStore} from '../types';

export const fetchStores = createAsyncThunk<UIStore[], void>(
  'stores/fetchStores',
  async (_, {rejectWithValue}) => {
    try {
      return await appComponent.storesService().getStores();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createOrUpdateStore = createAsyncThunk<UIStore, Store>(
  'stores/createOrUpdateStores',
  async (store: Store, {rejectWithValue}) => {
    try {
      return await appComponent.storesService().createOrUpdate(store);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const openAsyncBottomSheet = createAsyncThunk<
  UnknownMetadata,
  UnknownMetadata
>(
  'stores/openAsyncBottomSheet',
  async (metadata: UnknownMetadata, {rejectWithValue}) => {
    try {
      console.log(metadata.type);
      //TODO: storesService.getBottomSheetMetadata(metadata) must return the data
      //FIXME: Hardcoded for now
      return {
        type: bottomSheetTypes.create,
        value: {},
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
