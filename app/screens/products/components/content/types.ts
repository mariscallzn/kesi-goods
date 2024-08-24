import {ActionCallback, ComponentMap, UIModel} from '@/inf/types';
import ProductItem from './ProductItem';
import {Category, Store} from '@/model/types';
import {UIProduct} from '../../types';

export type ContentProps = {
  action: ActionCallback;
  store: Store;
};

export type CategoryProps = {
  category: Category;
  onCategoryPress: (category: Category) => void;
  isSelected: boolean;
};

type ComponentTypeMap = {
  productItem: UIProduct;
};

export type IView = UIModel<ComponentTypeMap> & {};

export const componentMap: ComponentMap<ComponentTypeMap> = {
  productItem: ProductItem,
};
