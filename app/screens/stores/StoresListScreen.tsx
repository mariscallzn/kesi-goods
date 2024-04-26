import React, {FC} from 'react';
import {Text, View} from 'react-native';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';

const StoresListScreen: FC<ShoppingStackScreenProps<'StoresList'>> = () => {
  return (
    <View>
      <Text>StoresList</Text>
    </View>
  );
};

export default StoresListScreen;
