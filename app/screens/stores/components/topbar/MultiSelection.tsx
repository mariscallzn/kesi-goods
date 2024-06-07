import React from 'react';
import {View, ViewStyle} from 'react-native';
import {Button, IconButton, useTheme} from 'react-native-paper';
import {MultiSelectionProps, topBarActions} from './types';
import {translate} from '../../../../i18n/translate';

const MultiSelection: React.FC<MultiSelectionProps> = props => {
  const {colors, roundness} = useTheme();
  const isEditDisabled = props.selectedItems.length >= 2;
  return (
    <View
      style={[
        $container,
        {
          backgroundColor: colors.primaryContainer,
          borderRadius: roundness,
        },
      ]}>
      <View
        style={[
          $shadow,
          {
            borderBottomStartRadius: roundness,
            borderTopStartRadius: roundness,
          },
        ]}>
        <IconButton
          size={22}
          iconColor={colors.onPrimaryContainer}
          style={$closeButton}
          icon={'close'}
          onPress={() =>
            props.action({
              metadata: {type: topBarActions.close, value: undefined},
            })
          }
        />
      </View>
      <View style={[$buttonsContainer]}>
        {isEditDisabled ? (
          <View style={[$shadow, $actionButton]}>
            <Button
              textColor={
                colors.onPrimaryContainer
              }>{`(${props.selectedItems.length})`}</Button>
          </View>
        ) : (
          <Button
            style={$actionButton}
            onPress={() =>
              props.action({
                metadata: {
                  type: topBarActions.edit,
                  value: props.selectedItems[0],
                },
              })
            }>
            {translate('common.edit').toUpperCase()}
          </Button>
        )}
        <Button
          style={$actionButton}
          onPress={() =>
            props.action({
              metadata: {type: topBarActions.copy, value: props.selectedItems},
            })
          }>
          {translate('common.copy').toUpperCase()}
        </Button>
        <Button
          textColor={colors.error}
          style={$actionButton}
          onPress={() =>
            props.action({
              metadata: {
                type: topBarActions.delete,
                value: props.selectedItems,
              },
            })
          }>
          {translate('common.delete').toUpperCase()}
        </Button>
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  margin: 16,
};

const $buttonsContainer: ViewStyle = {
  flex: 1,
  height: '100%',
  alignItems: 'center',
  flexDirection: 'row',
};

const $shadow: ViewStyle = {
  backgroundColor: '#00000080',
};

const $actionButton: ViewStyle = {
  flex: 1,
};

const $closeButton: ViewStyle = {
  margin: 0,
};

export default MultiSelection;
