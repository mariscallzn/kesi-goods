import {Store} from '../../../model/types';
import {UnknownMetadata} from '../../../utils/types';
import {CopyListOption, UIStore} from '../types';

export interface StoresState {
  stores: UIStore[];
  bottomSheet: BottomSheet;
  footer: FooterState;
}

interface BottomSheet {
  isVisible: boolean;
  /**
   * (Optional)
   * Used to notify the consumer that there is a Async operation going on
   */
  isLoading?: boolean;
  metadata?: UnknownMetadata;
}

interface FooterState {
  snackbar: SnackbarState;
}

interface SnackbarState {
  visible: boolean;
  metadata: UnknownMetadata;
}

export const initialState: StoresState = {
  stores: [],
  bottomSheet: {
    isVisible: false,
  },
  footer: {
    snackbar: {
      visible: false,
      metadata: {type: '', value: undefined},
    },
  },
};

export type CopyListThunkArgs = {
  store: Store;
  copyOption: CopyListOption;
};
