import React from 'react';

import ShoppingNavigator, {ShoppingStackParamList} from './ShoppingNavigator';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';

//#region Types
export type RootStackParamList = {
  Shopping: NavigatorScreenParams<ShoppingStackParamList>;
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

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Shopping" component={ShoppingNavigator} />
    </Stack.Navigator>
  );
};

export const RootNavigator = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};
//#endregion
