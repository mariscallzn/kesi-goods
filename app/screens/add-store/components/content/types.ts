import {ViewProps} from 'react-native';
import {ControlledTextInputRef} from '../../../../components/ControlledTextInput';

export type ContentProps = ViewProps & {
  nameRef: React.RefObject<ControlledTextInputRef>;
};
