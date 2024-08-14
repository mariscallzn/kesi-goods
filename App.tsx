import {RootStack, RootStackParamList} from '@/routes/RootNavigator';

import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import React, {useEffect} from 'react';
import {Linking, ViewStyle, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import outputs from './amplify_outputs.json';
import {store} from './app/redux/store';
import {KesiDarkTheme, KesiLightTheme} from './app/theme/theme';
import {Authenticator} from '@aws-amplify/ui-react-native';

Amplify.configure(outputs);

//💡 Unlock a year of premium if users goes through all X adds 💡
function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  useEffect(() => {
    const handleUrl = (event: {url: string}) => {
      const url = event.url;
      if (url) {
        const listId = url.split('/').pop();
        if (listId) {
          // Navigate to the List screen with the listId
          navigationRef.navigate('ShoppingList', {listId: listId});
        }
      }
    };

    Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleUrl({url});
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [navigationRef]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={$container}>
        <Provider store={store}>
          <PaperProvider
            theme={colorScheme === 'dark' ? KesiDarkTheme : KesiLightTheme}>
            <Authenticator.Provider>
              <NavigationContainer ref={navigationRef}>
                <RootStack />
              </NavigationContainer>
            </Authenticator.Provider>
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
