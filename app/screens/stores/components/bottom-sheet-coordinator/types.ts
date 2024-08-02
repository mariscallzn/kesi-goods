import {MaxHeight} from '../../../../components/BottomSheet';
import {ActionCallback} from '../../../../inf/multiViewRenderer';

export type BottomSheetCoordinatorProps = {
  action: ActionCallback;
  maxHeight: MaxHeight;
};

/**
 * Type to ensure all needed types are listed and defined on {@link bottomSheetTypes}
 */
type BottomSheetTypes = {
  openItemMenu: string;
  addOrUpdateList: string;
  copyListOptions: string;
  shareList: string;
  deleteList: string;
};

export const bottomSheetTypes: BottomSheetTypes = {
  openItemMenu: 'openItemMenu',
  addOrUpdateList: 'addOrUpdateList',
  copyListOptions: 'copyListOptions',
  shareList: 'shareList',
  deleteList: 'deleteList',
};
