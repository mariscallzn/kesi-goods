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

type ContentActions = {
  header: {back: string};
  shoppingListItem: {
    onCheckPress: string;
    onLongPress: string;
  };
};

export const CONTENT_ACTIONS: ContentActions = {
  header: {
    back: 'back',
  },
  shoppingListItem: {
    onCheckPress: 'onCheckPress',
    onLongPress: 'onLongPress',
  },
};
