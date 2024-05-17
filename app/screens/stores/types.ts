import {UIModelProps} from '../../inf/multiViewRenderer';
import {Store} from '../../model/types';

export interface UIStore extends UIModelProps {
  store: Store;
  multiSelectionEnabled: boolean;
}

export interface ListSuggestions {
  stores: string[];
  misc: string[];
}

type ContentActions = {
  navigateToShoppingList: string;
  itemMenu: string;
  enableMultiSelection: string;
  itemSelected: string;
  itemUnselected: string;
};

export const CONTENT_ACTIONS: ContentActions = {
  navigateToShoppingList: 'navigateToShoppingList',
  itemMenu: 'itemMenu',
  enableMultiSelection: 'enableMultiSelection',
  itemSelected: 'itemSelected',
  itemUnselected: 'itemUnselected',
};

export type CopyListOption = 'whole-list' | 'checked-items' | 'unchecked-items';
