import React from 'react';
import {RootNavigator} from './app/routes/RootNavigator';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
