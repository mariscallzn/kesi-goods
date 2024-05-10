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
  shoppingListItem: {
    onCheckPress: string;
    onItemPress: string;
  };
};

export const CONTENT_ACTIONS: ContentActions = {
  shoppingListItem: {
    onCheckPress: 'onCheckPress',
    onItemPress: 'onItemPress',
  },
};
