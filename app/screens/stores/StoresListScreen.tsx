import React, {FC} from 'react';
import {Text} from 'react-native';
import {Screen} from '../../components/Screen';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';

const StoresListScreen: FC<ShoppingStackScreenProps<'StoresList'>> = () => {
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Text>StoresList</Text>
    </Screen>
  );
};

export default StoresListScreen;
