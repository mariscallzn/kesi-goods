import {UIModelProps} from '@/inf/multiViewRenderer';
import {Store} from '@/model/types';
export interface UIStore extends UIModelProps {
  store: Store;
  multiSelectionEnabled: boolean;
}

type ContentActions = {
  addStoreScreen: string;
  navigateToShoppingList: string;
  itemMenu: string;
  enableMultiSelection: string;
  itemSelected: string;
  itemUnselected: string;
};

export const CONTENT_ACTIONS: ContentActions = {
  addStoreScreen: 'addStoreScreen',
  navigateToShoppingList: 'navigateToShoppingList',
  itemMenu: 'itemMenu',
  enableMultiSelection: 'enableMultiSelection',
  itemSelected: 'itemSelected',
  itemUnselected: 'itemUnselected',
};

export type CopyListOption = 'whole-list' | 'checked-items' | 'unchecked-items';
