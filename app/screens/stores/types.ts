import {UIModelProps} from '../../inf/multiViewRenderer';
import {Store} from '../../model/types';

export interface UIStore extends UIModelProps {
  store: Store;
}

export interface ListSuggestions {
  stores: string[];
  misc: string[];
}

type ContentActions = {
  navigateToShoppingList: string;
  itemMenu: string;
};

export const CONTENT_ACTIONS: ContentActions = {
  navigateToShoppingList: 'navigateToShoppingList',
  itemMenu: 'itemMenu',
};

export type CopyListOption = 'whole-list' | 'checked-items' | 'unchecked-items';
