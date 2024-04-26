import React from 'react';
import {CompositeScreenProps} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import StoresListScreen from '../screens/stores/StoresListScreen';
import {RootStackParamList, RootStackScreenProps} from './RootNavigator';
import ShoppingListScreen from '../screens/shopping/ShoppingListScreen';
import ProductsScreen from '../screens/products/ProductsScreen';

//#region Types
export type ShoppingStackParamList = {
  StoresList: undefined;
  ShoppingList: {
    listId: string;
  };
  Products: {
    listId?: string;
  };
};

export type ShoppingStackScreenProps<T extends keyof ShoppingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ShoppingStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
//#endregion

//#region Stack
const Stack = createNativeStackNavigator<ShoppingStackParamList>();

const ShoppingNavigator = (): React.JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StoresList" component={StoresListScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
    </Stack.Navigator>
  );
};

export default ShoppingNavigator;
//#endregion
