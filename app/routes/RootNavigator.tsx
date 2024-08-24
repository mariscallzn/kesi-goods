import React from 'react';
import AddStoreScreen from '@/screens/add-store/AddStoreScreen';
import GlobalSettingsScreen from '@/screens/global-settings/GlobalSettingsScreen';
import ProductsScreen from '@/screens/products/ProductsScreen';
import ShoppingListScreen from '@/screens/shopping/ShoppingListScreen';
import StoresScreen from '@/screens/stores/StoresScreen';
import {NavigationContainer} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Login from '@/screens/login/Login';
import {Store} from '@/model/types';

//#region Types
export type RootStackParamList = {
  AddStore: undefined;
  Stores: undefined;
  ShoppingList: {
    store: Store;
  };
  Products: {
    store: Store;
  };
  GlobalSettings: undefined;
  Login: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
//#endregion

//#region Interfaces
export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}
//#endregion

//#region App Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Stores" component={StoresScreen} />
      <Stack.Screen name="AddStore" component={AddStoreScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="GlobalSettings" component={GlobalSettingsScreen} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};
//#endregion
