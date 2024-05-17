import {ViewProps} from 'react-native/types';
import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {Store} from '../../../../model/types';

export type TopBarPros = ViewProps & {};

export type MultiSelectionProps = {
  selectedItems: Store[];
  action: ActionCallback;
};

type TopBarActions = {
  close: string;
  edit: string;
  copy: string;
  delete: string;
};

export const topBarActions: TopBarActions = {
  close: 'close',
  edit: 'edit',
  copy: 'copy',
  delete: 'delete',
};
