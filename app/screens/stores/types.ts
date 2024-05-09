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
};

export const CONTENT_ACTIONS: ContentActions = {
  navigateToShoppingList: 'navigateToShoppingList',
};
