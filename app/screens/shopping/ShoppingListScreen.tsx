import React, {FC} from 'react';
import {Text} from 'react-native';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import {Screen} from '../../components/Screen';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> = () => {
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Text>ShoppingListScreen</Text>
    </Screen>
  );
};

export default ShoppingListScreen;
