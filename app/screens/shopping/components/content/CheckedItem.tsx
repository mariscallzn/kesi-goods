import {View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {CONTENT_ACTIONS, UICheckedItem} from '../../types';
import {OnCheckPressType} from './types';

const CheckedItem: React.FC<UICheckedItem> = props => {
  const [checked, setChecked] = React.useState(props.shoppingListItem.checked);
  const {colors} = useTheme();
  return (
    <View style={$container}>
      <IconButton
        size={24}
        iconColor={checked ? 'green' : colors.primary}
        icon={checked ? 'check' : 'circle-outline'}
        onPress={() => {
          props.action?.({
            metadata: {
              type: CONTENT_ACTIONS.shoppingListItem.onCheckPress,
              value: {
                itemId: props.shoppingListItem.id,
                checked: !checked,
              } as OnCheckPressType,
            },
          });
          setChecked(!checked);
        }}
      />
      <Text
        variant="bodyLarge"
        style={[$title, {color: colors.onSurfaceDisabled}]}>
        {props.shoppingListItem.product.name}
      </Text>
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const $title: ViewStyle = {
  flex: 1,
};

const shallowEqual = (a: UICheckedItem, b: UICheckedItem) => {
  return (
    a.itemLocation === b.itemLocation &&
    a.shoppingListItem === b.shoppingListItem
  );
};

export default memo(CheckedItem, shallowEqual);
