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
import {ViewStyle} from 'react-native';

function App(): React.JSX.Element {
  //TODO: https://callstack.github.io/react-native-paper/docs/guides/getting-started/#customization
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={$container}>
        <Provider store={store}>
          <PaperProvider>
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
