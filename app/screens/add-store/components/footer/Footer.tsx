import React from 'react';
import {KeyboardAvoidingView, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import {FooterProps} from './types';
import {translate} from '../../../../i18n/translate';
import {CONTENT_ACTIONS} from '../../types';

const Footer: React.FC<FooterProps> = props => {
  return (
    <KeyboardAvoidingView style={$container} behavior="height">
      <Button
        mode="contained"
        style={$button}
        onPress={() =>
          props.action({
            metadata: {type: CONTENT_ACTIONS.createList, value: undefined},
          })
        }>
        {translate('common.create').toUpperCase()}
      </Button>
    </KeyboardAvoidingView>
  );
};

const $container: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  start: 0,
  end: 0,
};

const $button: ViewStyle = {
  margin: 16,
};

export default Footer;
