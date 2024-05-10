import {UIModelProps} from '../../inf/multiViewRenderer';
import {ShoppingListItem} from '../../model/types';

export interface UIShoppingListItem extends UIModelProps {
  shoppingListItem: ShoppingListItem;
}

export type ListInfo = {
  listName: string;
  progress: number;
  shoppingListItems: UIShoppingListItem[];
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
