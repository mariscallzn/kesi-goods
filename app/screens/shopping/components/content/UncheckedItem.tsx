import React, {memo} from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import {Divider, IconButton, Text, useTheme} from 'react-native-paper';
import {CONTENT_ACTIONS, UIUncheckedItem} from '../../types';
import {OnCheckPressType} from './types';

const UncheckedItem: React.FC<UIUncheckedItem> = props => {
  const [checked, setChecked] = React.useState(props.shoppingListItem.checked);
  const {colors} = useTheme();
  return (
    <Pressable
      style={[{backgroundColor: colors.backdrop}]}
      onLongPress={() =>
        props.action?.({
          metadata: {
            type: CONTENT_ACTIONS.shoppingListItem.onLongPress,
            value: props.shoppingListItem,
          },
        })
      }>
      <>
        <View style={$container}>
          {props.shoppingListItem.category && (
            <View
              style={{
                ...$categoryView,
                backgroundColor:
                  props.shoppingListItem.category?.color !== ''
                    ? props.shoppingListItem.category?.color
                    : undefined,
              }}
            />
          )}
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
            style={[$title, {color: colors.onBackground}]}>
            {props.shoppingListItem.product.name}
          </Text>
          {props.shoppingListItem.quantity > 1 && (
            <View
              style={[$amountContainer, {backgroundColor: colors.onPrimary}]}>
              <Text
                style={[$amount, {color: colors.primary}]}
                variant={'labelLarge'}>
                {props.shoppingListItem.quantity + props.shoppingListItem.unit}
              </Text>
            </View>
          )}
        </View>
        {props.itemLocation !== 'tail' && <Divider />}
      </>
    </Pressable>
  );
};

const $container: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const $categoryView: ViewStyle = {
  width: 4,
  height: '100%',
};

const $title: ViewStyle = {
  flex: 1,
};

const $amountContainer: ViewStyle = {
  marginHorizontal: 16,
  borderRadius: 32,
  alignItems: 'center',
  justifyContent: 'center',
};

const $amount: ViewStyle = {
  marginHorizontal: 16,
};

const shallowEqual = (a: UIUncheckedItem, b: UIUncheckedItem) => {
  return (
    a.itemLocation === b.itemLocation &&
    a.shoppingListItem === b.shoppingListItem
  );
};

export default memo(UncheckedItem, shallowEqual);
