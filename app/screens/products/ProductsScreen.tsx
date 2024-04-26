import {View, Text} from 'react-native';
import React, {FC} from 'react';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';

const ProductsScreen: FC<ShoppingStackScreenProps<'Products'>> = () => {
  return (
    <View>
      <Text>ProductsScreen</Text>
    </View>
  );
};

export default ProductsScreen;
