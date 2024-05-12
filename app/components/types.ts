import {TranslateOptions} from 'i18n-js';
import {TxKeyPath} from '../i18n/translate';
import {ActionCallback} from '../inf/multiViewRenderer';

type BottomSheetActions = {
  close: string;
  create: string;
  manage: string;
  add: string;
  back: string;
  update: string;
};

export const bottomSheetActions: BottomSheetActions = {
  close: 'close',
  create: 'create',
  manage: 'manage',
  add: 'add',
  back: 'back',
  update: 'update',
};

export type GenericBottomSheetToolBarProps = {
  action: ActionCallback;
  title: {key: TxKeyPath; options?: TranslateOptions | undefined};
};

export type GenericRowProps = {
  title: GenericRowTitle;
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
  rippleColor?: string;
};
