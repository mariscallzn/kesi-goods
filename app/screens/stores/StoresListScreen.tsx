import React, {FC} from 'react';
import {Button, Text} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import {addOne, minusOne} from './storesListSlice';

const StoresListScreen: FC<ShoppingStackScreenProps<'StoresList'>> = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((root: RootState) => root.stores);
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Text>{selector.counter}</Text>
      <Button icon="camera" mode="contained" onPress={() => dispatch(addOne())}>
        +1
      </Button>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => dispatch(minusOne())}>
        -1
      </Button>
    </Screen>
  );
};

export default StoresListScreen;
