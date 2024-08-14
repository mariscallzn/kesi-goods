import {TranslateOptions} from 'i18n-js';
import {TxKeyPath} from '../i18n/translate';
import {Action, ActionCallback} from '../inf/multiViewRenderer';

type BottomSheetActions = {
  close: string;
  create: string;
  manage: string;
  add: string;
  back: string;
  rename: string;
  update: string;
  copy: string;
  share: string;
  createLink: string;
  login: string;
  delete: string;
  wholeList: string;
  checkedItems: string;
  uncheckedItems: string;
  uncheckAll: string;
  deleteChecked: string;
  search: string;
};

export const bottomSheetActions: BottomSheetActions = {
  close: 'close',
  create: 'create',
  manage: 'manage',
  add: 'add',
  back: 'back',
  rename: 'rename',
  update: 'update',
  copy: 'copy',
  share: 'share',
  createLink: 'createLink',
  login: 'login',
  delete: 'delete',
  wholeList: 'wholeList',
  checkedItems: 'checkedItems',
  uncheckedItems: 'uncheckedItems',
  uncheckAll: 'uncheckAll',
  deleteChecked: 'deleteChecked',
  search: 'search',
};

export type GenericBottomSheetToolBarProps = {
  action: ActionCallback;
  title: {key: TxKeyPath; options?: TranslateOptions | undefined};
};

export type GenericRowProps = {
  title: GenericRowTitle;
  disabled?: boolean;
  action?: GenericAction;
  rightIcon?: GenericRowIcon;
  leftIcon?: GenericRowIcon;
};

type GenericRowIcon = {
  icon: string;
  color?: string;
};

type GenericRowTitle = {
  title: {key: TxKeyPath; options?: TranslateOptions | undefined};
  color?: string;
};

type GenericAction = {
  action: ActionCallback;
  passOnMetadata?: Action;
  rippleColor?: string;
};
