import {ViewProps} from 'react-native';
import {ActionCallback} from '../../../../inf/multiViewRenderer';

export type FooterProps = ViewProps & {
  storeListId: string;
  action: ActionCallback;
};
