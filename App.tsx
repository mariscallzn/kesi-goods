import React from 'react';
import {RootNavigator} from './app/routes/RootNavigator';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';

function App(): React.JSX.Element {
  //TODO: https://callstack.github.io/react-native-paper/docs/guides/getting-started/#customization
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
