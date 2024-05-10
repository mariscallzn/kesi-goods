import React, {memo} from 'react';
import {View, ViewStyle} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Divider, IconButton, Text, useTheme} from 'react-native-paper';
import {shallowEqual} from 'react-redux';
import {CONTENT_ACTIONS, UIShoppingListItem} from '../../types';
import {OnCheckPressType} from './types';

const ShoppingListItem: React.FC<UIShoppingListItem> = props => {
  const [checked, setChecked] = React.useState(props.shoppingListItem.checked);
  const {colors} = useTheme();
  return (
    <TouchableWithoutFeedback
      style={[{backgroundColor: checked ? undefined : colors.backdrop}]}
      onLongPress={() => props.action?.({metadata: {type: '', value: {}}})}>
      <>
        <View style={$container}>
          {props.shoppingListItem.category && !checked && (
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
            style={[
              $title,
              {color: checked ? colors.onSurfaceDisabled : colors.onBackground},
            ]}>
            {props.shoppingListItem.product.name}
          </Text>
          {props.shoppingListItem.quantity > 0 && !checked && (
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
        {!props.shoppingListItem.checked && <Divider />}
      </>
    </TouchableWithoutFeedback>
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

export default memo(ShoppingListItem, shallowEqual);
