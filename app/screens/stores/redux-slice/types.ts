import {Store} from '../../../model/types';
import {UnknownMetadata} from '../../../utils/types';
import {CopyListOption, UIStore} from '../types';

export interface StoresState {
  stores: UIStore[];
  bottomSheet: BottomSheet;
}

export interface BottomSheet {
  isVisible: boolean;
  /**
   * (Optional)
   * Used to notify the consumer that there is a Async operation going on
   */
  isLoading?: boolean;
  metadata?: UnknownMetadata;
}

export const initialState: StoresState = {
  stores: [],
  bottomSheet: {
    isVisible: false,
  },
};

export type CopyListThunkArgs = {
  store: Store;
  copyOption: CopyListOption;
};
