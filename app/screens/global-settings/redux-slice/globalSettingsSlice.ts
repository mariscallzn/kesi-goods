import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {GlobalSettingsState, initialState} from './types';
import {KUser} from '@/model/types';
import {appComponent} from '@/di/appComponent';
import {getCurrentUser as resetUser} from '@/screens/stores/redux-slice/storesSlice';

//#region Slice
const globalSettingSlice = createSlice({
  name: 'globalSettings',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    getCurrentUserReducer(builder);
    logOutReducer(builder);
  },
});
//#endregion

//#region AsyncThunks
export const getCurrentUser = createAsyncThunk<KUser | undefined, void>(
  'globalSettings/getCurrentUser',
  async (_, {rejectWithValue}) => {
    try {
      return appComponent.globalSettingsService().getActiveSession();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const getCurrentUserReducer = (
  builder: ActionReducerMapBuilder<GlobalSettingsState>,
) => {
  builder.addCase(getCurrentUser.fulfilled, (state, action) => {
    state.user = action.payload;
  });
  builder.addCase(getCurrentUser.rejected, state => {
    state.user = undefined;
  });
};
//#endregion

//#region Logout
export const logOut = createAsyncThunk(
  'globalSettings/logOut',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      await appComponent.globalSettingsService().logOut();
      dispatch(resetUser());
      //TODO: Delete all
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const logOutReducer = (
  builder: ActionReducerMapBuilder<GlobalSettingsState>,
) => {
  builder.addCase(logOut.pending, state => {
    state.isLoggingOut = true;
  });
  builder.addCase(logOut.fulfilled, state => {
    state.isLoggingOut = false;
    state.user = undefined;
  });
};
//#endregion
export default globalSettingSlice.reducer;
