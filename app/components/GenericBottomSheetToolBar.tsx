import {View, ViewStyle} from 'react-native';
import React from 'react';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {translate} from '../i18n/translate';
import {GenericBottomSheetToolBarProps, bottomSheetActions} from './types';

const GenericBottomSheetToolBar: React.FC<
  GenericBottomSheetToolBarProps
> = props => {
  const {colors} = useTheme();
  return (
    <View style={$topBar}>
      <Text variant="titleLarge" style={$topBarTitle}>
        {translate(props.title.key, props.title.options)}
      </Text>
      <IconButton
        style={$iconButton}
        icon={'close'}
        size={18}
        iconColor={colors.onSurfaceDisabled}
        containerColor={colors.backdrop}
        onPress={() =>
          props.action({
            metadata: {type: bottomSheetActions.close, value: {}},
          })
        }
      />
    </View>
  );
};

const $topBar: ViewStyle = {
  flexDirection: 'row',
  marginHorizontal: 16,
  marginBottom: 16,
  alignItems: 'center',
};

const $topBarTitle: ViewStyle = {
  flex: 1,
};

const $iconButton: ViewStyle = {
  margin: 0,
};

export default GenericBottomSheetToolBar;
