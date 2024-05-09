import {ViewProps} from 'react-native/types';
import {ActionCallback} from '../../../../inf/multiViewRenderer';

export type HeaderProps = ViewProps & {
  action: ActionCallback;
};
