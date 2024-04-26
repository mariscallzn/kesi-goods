/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Constants from 'expo-constants';
import {Text} from 'react-native';
import {translate} from './app/i18n/translate';
console.log(Constants.systemFonts);

function App(): React.JSX.Element {
  return <Text>{translate('ShoppingListsScreen.addShoppingList')}</Text>;
}

export default App;
