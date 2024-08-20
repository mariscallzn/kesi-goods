import {Screen} from '@/components/Screen';
import {useAppDispatch} from '@/redux/store';
import {RootStackScreenProps} from '@/routes/RootNavigator';
import {
  Authenticator,
  ThemeProvider,
  useAuthenticator,
} from '@aws-amplify/ui-react-native';
import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {useTheme} from 'react-native-paper';
import {syncUp} from '../stores/redux-slice/storesSlice';

const Login: React.FC<RootStackScreenProps<'Login'>> = ({navigation}) => {
  const {route} = useAuthenticator();
  const colorMode = useColorScheme();
  const {colors} = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (route === 'authenticated') {
      dispatch(syncUp());
      navigation.popToTop();
    }
  }, [navigation, route, dispatch]);

  return (
    <ThemeProvider
      colorMode={colorMode}
      theme={{
        tokens: {
          colors: {
            background: {
              primary: colors.background,
              error: colors.errorContainer,
            },
            font: {
              primary: colors.onBackground,
              secondary: colors.onSurfaceVariant,
              error: colors.onErrorContainer,
            },
            red: {
              10: colors.error,
              20: colors.error,
              30: colors.error,
              40: colors.error,
              50: colors.error,
              60: colors.error,
              70: colors.error,
              80: colors.error,
              90: colors.error,
              100: colors.error,
            },
            primary: {
              10: colors.primary,
              20: colors.primary,
              30: colors.primary,
              40: colors.primary,
              50: colors.primary,
              60: colors.primary,
              70: colors.primary,
              80: colors.primary,
              90: colors.primary,
              100: colors.primary,
            },
          },
        },
      }}>
      <Authenticator>
        <Screen safeAreaEdges={['top', 'bottom']} />
      </Authenticator>
    </ThemeProvider>
  );
};

export default Login;
