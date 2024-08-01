import {ActionCallback, ComponentMap, UIModel} from '../../../../inf/types';
import {Category} from '../../../../model/types';
import {UIProduct} from '../../types';
import ProductItem from './ProductItem';

export type ContentProps = {
  action: ActionCallback;
  listId: string;
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
