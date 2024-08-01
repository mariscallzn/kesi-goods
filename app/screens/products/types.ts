import {Category, Product} from '../../model/types';
import {IView} from './components/content/types';

export interface UIProduct extends IView {
  shoppingListId: string;
  product: Product;
  checked: boolean;
  categories: Category[];
  units: string[];
  selectedUnit?: string;
  quantity?: number;
  selectedCategory?: Category;
}

type ContentActions = {
  back: string;
};

export const CONTENT_ACTIONS: ContentActions = {
  back: 'back',
};

type ProductItemAction = {
  update: string;
};

export const PRODUCT_ITEM_ACTION: ProductItemAction = {
  update: 'update',
};
