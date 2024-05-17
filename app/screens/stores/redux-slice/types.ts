import {Store} from '../../../model/types';
import {UnknownMetadata} from '../../../utils/types';
import {CopyListOption, UIStore} from '../types';

export interface StoresState {
  stores: UIStore[];
  bottomSheet: BottomSheet;
  snackbar: SnackbarState;
  multiSelection: MultiSelection;
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

interface SnackbarState {
  visible: boolean;
  metadata: UnknownMetadata;
}

interface MultiSelection {
  isEnabled: boolean;
  selectedItems: Store[];
}

export const initialState: StoresState = {
  stores: [],
  bottomSheet: {
    isVisible: false,
  },
  snackbar: {
    visible: false,
    metadata: {type: '', value: undefined},
  },
  multiSelection: {
    isEnabled: false,
    selectedItems: [],
  },
};

export type CopyListThunkArgs = {
  stores: Store[];
  copyOption: CopyListOption;
};

export type MultiSelectionArgs = {
  addOrRemove: 'add' | 'remove';
  store: Store;
};
