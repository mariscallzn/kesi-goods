import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {UIShoppingListItem} from '../../types';
import ShoppingListItem from './ShoppingListItem';

export type ContentProps = {
  action: ActionCallback;
};

type CustomViewTypes = {
  shoppingListItem: React.FC<UIShoppingListItem>;
};

export const CUSTOM_VIEWS: CustomViewTypes = {
  shoppingListItem: ShoppingListItem,
};

export const VIEW_ID = {
  shoppingListItem: 'shoppingListItem',
};

export type OnCheckPressType = {
  itemId: string;
  checked: boolean;
};
