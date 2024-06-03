import {Action, UIModelProps} from '../../../inf/multiViewRenderer';
import {ShoppingListItem} from '../../../model/types';

interface HeaderInfo {
  searchTerm?: string;
}

export interface ProductsState {
  headerInfo: HeaderInfo;
  items: UIModelProps[];
  snapshot: ShoppingListItem[];
  goBack: boolean;
}

export const initialState: ProductsState = {
  headerInfo: {},
  items: [],
  snapshot: [],
  goBack: false,
};

export type InitData = {
  items: UIModelProps[];
  snapshot: ShoppingListItem[];
};

export type ListIdSearchTermArgs = {
  listId: string;
  term?: string;
};

export type UserActionArgs = {
  listId: string;
  action: Action;
};
