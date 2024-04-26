import React from 'react';
import {RootNavigator} from './app/routes/RootNavigator';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';

function App(): React.JSX.Element {
  //TODO: https://callstack.github.io/react-native-paper/docs/guides/getting-started/#customization
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <PaperProvider>
          <RootNavigator />
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
