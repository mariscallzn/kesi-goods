import {UIModelProps} from '../../inf/multiViewRenderer';
import {Store} from '../../model/types';

export type UITypes = {
  store: 'store';
};

export interface UIStore extends UIModelProps {
  store: Store;
}

export interface ListSuggestions {
  stores: string[];
  misc: string[];
}
