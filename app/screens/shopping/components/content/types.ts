import {ActionCallback} from '../../../../inf/multiViewRenderer';
import {UICheckedItem, UIUncheckedItem} from '../../types';
import CheckedItem from './CheckedItem';
import UncheckedItem from './UncheckedItem';

export type ContentProps = {
  action: ActionCallback;
};

type CustomViewTypes = {
  uncheckedItem: React.FC<UIUncheckedItem>;
  checkedItem: React.FC<UICheckedItem>;
};

export const CUSTOM_VIEWS: CustomViewTypes = {
  uncheckedItem: UncheckedItem,
  checkedItem: CheckedItem,
};

export const VIEW_ID = {
  uncheckedItem: 'uncheckedItem',
  checkedItem: 'checkedItem',
};

export type OnCheckPressType = {
  itemId: string;
  checked: boolean;
};
