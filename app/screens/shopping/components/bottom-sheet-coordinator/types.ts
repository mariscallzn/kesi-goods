import {MaxHeight} from '../../../../components/BottomSheet';
import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {ShoppingListItem} from '../../../../model/types';

export type BottomSheetCoordinatorProps = {
  action: ActionCallback;
  maxHeight: MaxHeight;
};

export interface AddOrUpdateBSMetadata {
  listId: string;
  shoppingListItem?: ShoppingListItem;
  units: string[];
}

type BottomSheetActions = {
  back: string;
  add: string;
  update: string;
};

export const bottomSheetActions: BottomSheetActions = {
  add: 'add',
  back: 'back',
  update: 'update',
};

/**
 * Type to ensure all needed types are listed and defined on {@link bottomSheetTypes}
 */
type BottomSheetTypes = {
  addOrUpdateItem: string;
};

export const bottomSheetTypes: BottomSheetTypes = {
  addOrUpdateItem: 'addOrUpdateItem',
};
