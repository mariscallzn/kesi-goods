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

/**
 * Type to ensure all needed types are listed and defined on {@link bottomSheetTypes}
 */
type BottomSheetTypes = {
  addOrUpdateItem: string;
};

export const bottomSheetTypes: BottomSheetTypes = {
  addOrUpdateItem: 'addOrUpdateItem',
};
