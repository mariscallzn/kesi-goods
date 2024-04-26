import {View, Text} from 'react-native';
import React, {FC} from 'react';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> = () => {
  return (
    <View>
      <Text>ShoppingListScreen</Text>
    </View>
  );
};

export default ShoppingListScreen;
