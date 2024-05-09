import {View, Text} from 'react-native';
import React from 'react';
import {UIShoppingListItem} from '../../types';

const ShoppingListItem: React.FC<UIShoppingListItem> = props => {
  return (
    <View>
      <Text>{JSON.stringify(props.shoppingListItem)}</Text>
    </View>
  );
};

export default ShoppingListItem;
