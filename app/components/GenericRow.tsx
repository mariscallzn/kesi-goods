import React from 'react';
import {ViewStyle} from 'react-native';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {translate} from '../i18n/translate';
import {GenericRowProps} from './types';

const GenericRow: React.FC<GenericRowProps> = props => {
  const {colors} = useTheme();
  return (
    <TouchableRipple
      borderless
      rippleColor={
        props.action?.rippleColor ? props.action.rippleColor : undefined
      }
      style={$container}
      onPress={
        props.action
          ? () => {
              props.action?.action?.(
                props.action.passOnMetadata ?? {
                  metadata: {type: 'undefined', value: undefined},
                },
              );
            }
          : undefined
      }>
      <>
        {props.leftIcon && (
          <Icon
            size={24}
            source={props.leftIcon?.icon}
            color={
              props.leftIcon?.color ? props.leftIcon.color : colors.onBackground
            }
          />
        )}
        <Text
          style={[
            $title,
            {
              color: props.title.color
                ? props.title.color
                : colors.onBackground,
            },
          ]}
          variant="bodyLarge">
          {translate(props.title.title.key, props.title.title.options)}
        </Text>
        {props.rightIcon && (
          <Icon
            size={24}
            source={props.rightIcon?.icon}
            color={
              props.rightIcon?.color
                ? props.rightIcon.color
                : colors.onBackground
            }
          />
        )}
      </>
    </TouchableRipple>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 4,
  borderRadius: 8,
  padding: 12,
  marginVertical: 4,
};

const $title: ViewStyle = {
  flex: 1,
  marginHorizontal: 16,
};

export default GenericRow;
