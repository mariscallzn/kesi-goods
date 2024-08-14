import {KUser} from '@/model/types';

export interface GlobalSettingsState {
  user?: KUser;
  isLoggingOut: boolean;
}

export const initialState: GlobalSettingsState = {
  user: undefined,
  isLoggingOut: false,
};
