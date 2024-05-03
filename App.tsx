import React from 'react';
import {RootNavigator} from './app/routes/RootNavigator';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ViewStyle, useColorScheme} from 'react-native';
import {KesiDarkTheme, KesiLightTheme} from './app/theme/theme';

//💡 Unlock a year of premium if users goes through all X adds 💡
function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={$container}>
        <Provider store={store}>
          <PaperProvider
            theme={colorScheme === 'dark' ? KesiDarkTheme : KesiLightTheme}>
            <RootNavigator />
          </PaperProvider>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const $container: ViewStyle = {
  flex: 1,
};

export default App;
