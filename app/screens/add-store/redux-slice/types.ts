import {Suggestions} from '../types';

export interface AddStoreState {
  goBack: boolean;
  suggestions: Suggestions;
}

export const initialState: AddStoreState = {
  goBack: false,
  suggestions: {
    stores: [],
    misc: [],
  },
};
