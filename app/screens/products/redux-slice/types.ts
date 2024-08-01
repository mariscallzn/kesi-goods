import {Action} from '../../../inf/types';
import {ShoppingListItem} from '../../../model/types';
import {IView} from '../components/content/types';

interface HeaderInfo {
  searchTerm?: string;
}

export interface ProductsState {
  headerInfo: HeaderInfo;
  items: IView[];
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
  items: IView[];
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
