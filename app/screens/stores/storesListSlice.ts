import {createSlice} from '@reduxjs/toolkit';

interface StoresListState {
  counter: number;
}

const initialState: StoresListState = {
  counter: 0,
};

const storesListSlice = createSlice({
  name: 'stores',
  initialState: initialState,
  reducers: {
    addOne: (state: StoresListState) => {
      state.counter += 1;
    },
    minusOne: (state: StoresListState) => {
      state.counter -= 1;
    },
  },
});

export const {addOne, minusOne} = storesListSlice.actions;
export default storesListSlice.reducer;
