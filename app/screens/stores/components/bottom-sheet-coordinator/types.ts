import {MaxHeight} from '../../../../components/BottomSheet';
import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {Store} from '../../../../model/types';

export type BottomSheetCoordinatorProps = {
  action: ActionCallback;
  maxHeight: MaxHeight;
};

export interface AddOrUpdateBSMetadata {
  store: Store;
}

/**
 * Type to ensure all needed types are listed and defined on {@link bottomSheetTypes}
 */
type BottomSheetTypes = {
  openItemMenu: string;
  addOrUpdateList: string;
  copyListOptions: string;
  deleteList: string;
};

export const bottomSheetTypes: BottomSheetTypes = {
  openItemMenu: 'openItemMenu',
  addOrUpdateList: 'addOrUpdateList',
  copyListOptions: 'copyListOptions',
  deleteList: 'deleteList',
};
