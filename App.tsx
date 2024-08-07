import React, {useEffect} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {store} from './app/redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Linking, ViewStyle, useColorScheme} from 'react-native';
import {KesiDarkTheme, KesiLightTheme} from './app/theme/theme';
import {RootStack} from '@/routes/RootNavigator';
import {ShoppingStackParamList} from '@/routes/ShoppingNavigator';

//💡 Unlock a year of premium if users goes through all X adds 💡
function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef<ShoppingStackParamList>();

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
            <NavigationContainer ref={navigationRef}>
              <RootStack />
            </NavigationContainer>
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
