import React, {FC} from 'react';
import {Icon, MD3Colors} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';

const StoresListScreen: FC<ShoppingStackScreenProps<'StoresList'>> = () => {
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Icon source="camera" color={MD3Colors.error50} size={20} />
    </Screen>
  );
};

export default StoresListScreen;
