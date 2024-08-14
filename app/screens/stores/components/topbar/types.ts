import {ViewProps} from 'react-native/types';
import {Store} from '@/model/types';
import {ActionCallback} from '@/inf/multiViewRenderer';

export type TopBarPros = ViewProps & {
  action: ActionCallback;
};

export type MultiSelectionProps = {
  selectedItems: Store[];
  action: ActionCallback;
};

type TopBarActions = {
  close: string;
  edit: string;
  copy: string;
  delete: string;
  settings: string;
};

export const topBarActions: TopBarActions = {
  close: 'close',
  edit: 'edit',
  copy: 'copy',
  delete: 'delete',
  settings: 'settings',
};
