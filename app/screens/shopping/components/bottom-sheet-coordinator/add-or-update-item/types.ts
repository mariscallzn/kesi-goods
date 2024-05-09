import {ActionCallback} from '../../../../../inf/multiViewRenderer';
import {Category} from '../../../../../model/types';
import {AddOrUpdateBSMetadata} from '../types';

export type AddOrUpdateItemProps = {
  metadata?: AddOrUpdateBSMetadata;
  action: ActionCallback;
};

export type CategoryProps = {
  category: Category;
  onCategoryPress: (category: Category) => void;
  isSelected: boolean;
};
