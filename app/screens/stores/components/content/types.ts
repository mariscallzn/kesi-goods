import React from 'react';
import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {NavigationMetadata} from '../../../../routes/types';
import {UIStore} from '../../types';
import StoreItem from './StoreItem';

export type ContentProps = {
  action: ActionCallback;
};

type CustomViewTypes = {
  store: React.FC<UIStore>;
};

export const CUSTOM_VIEWS: CustomViewTypes = {
  store: StoreItem,
};

/**
 * IDs must match {@link CUSTOM_VIEWS} keys
 */
export const VIEW_ID = {
  store: 'store',
};

export interface ShoppingListNavigationMetadata extends NavigationMetadata {
  storeId: string;
}
