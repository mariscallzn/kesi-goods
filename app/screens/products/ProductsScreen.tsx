import React, {FC} from 'react';
import {Text} from 'react-native';
import {Screen} from '../../components/Screen';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';

const ProductsScreen: FC<ShoppingStackScreenProps<'Products'>> = () => {
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Text>ProductsScreen</Text>
    </Screen>
  );
};

export default ProductsScreen;
