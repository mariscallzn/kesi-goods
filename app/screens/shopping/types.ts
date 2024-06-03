import {UIModelProps} from '../../inf/multiViewRenderer';
import {ShoppingListItem} from '../../model/types';

type ItemLocation = 'head' | 'body' | 'tail';
export interface UIUncheckedItem extends UIModelProps {
  shoppingListItem: ShoppingListItem;
  itemLocation: ItemLocation;
}

export interface UICheckedItem extends UIModelProps {
  shoppingListItem: ShoppingListItem;
  itemLocation: ItemLocation;
}

export type ListInfo = {
  listName: string;
  progress: number;
  shoppingListItems: UIModelProps[];
};

type RestoreItemsType = {
  restoreUnchecked: string;
  restoreDeleted: string;
};

export const RESTORE_TYPE: RestoreItemsType = {
  restoreDeleted: 'restoreDeleted',
  restoreUnchecked: 'restoreUnchecked',
};

type ContentActions = {
  header: {
    navigateToProducts: string;
    back: string;
    listMenu: string;
    disableSearchMode: string;
  };
  shoppingListItem: {
    onCheckPress: string;
    onLongPress: string;
  };
};

export const CONTENT_ACTIONS: ContentActions = {
  header: {
    navigateToProducts: 'navigateToProducts',
    back: 'back',
    listMenu: 'listMenu',
    disableSearchMode: 'disableSearchMode',
  },
  shoppingListItem: {
    onCheckPress: 'onCheckPress',
    onLongPress: 'onLongPress',
  },
};
