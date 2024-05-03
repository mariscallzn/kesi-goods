import React from 'react';
import {Action} from '../../../../inf/multiViewRenderer';
import {UIStore} from '../../types';
import StoreItem from './StoreItem';

export type ScreenContentProps = {
  action: (action: Action) => void;
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
