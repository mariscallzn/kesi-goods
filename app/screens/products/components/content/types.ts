import React from 'react';
import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {UIProduct} from '../../types';
import ProductItem from './ProductItem';
import {Category} from '../../../../model/types';

export type ContentProps = {
  action: ActionCallback;
  listId: string;
};

export type CategoryProps = {
  category: Category;
  onCategoryPress: (category: Category) => void;
  isSelected: boolean;
};

type CustomViewTypes = {
  productItem: React.FC<UIProduct>;
};

export type ViewIds = {
  productItem: string;
};

export const CUSTOM_VIEWS: CustomViewTypes = {
  productItem: ProductItem,
};

export const VIEW_ID: ViewIds = {
  productItem: 'productItem',
};
