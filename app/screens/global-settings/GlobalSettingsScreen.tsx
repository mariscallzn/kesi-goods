import {Screen} from '@/components/Screen';
import AccountAvatar from '@/components/account-avatar/AccountAvatar';
import LoginBanner from '@/components/login-banner/LoginBanner';
import {translate} from '@/i18n/translate';
import {useAppDispatch, useAppSelector} from '@/redux/store';
import {RootStackScreenProps} from '@/routes/RootNavigator';
import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import Header from './components/header/Header';
import {getCurrentUser, logOut} from './redux-slice/globalSettingsSlice';

const GlobalSettingsScreen: React.FC<
  RootStackScreenProps<'GlobalSettings'>
> = ({navigation}) => {
  const accountSelect = useAppSelector(state => state.globalSettings.user);
  const dispatch = useAppDispatch();
  const {colors} = useTheme();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Header goBack={() => navigation.goBack()} />
      {accountSelect ? (
        <View style={$accountContainer}>
          <AccountAvatar user={accountSelect} size={80} />
          <Text variant="titleMedium">{accountSelect.email}</Text>
        </View>
      ) : (
        <LoginBanner onPress={() => navigation.navigate('Login')} />
      )}
      {accountSelect ? (
        <LogOutButton color={colors.error} onPress={() => dispatch(logOut())} />
      ) : null}
    </Screen>
  );
};

const LogOutButton: React.FC<{onPress: () => void; color: string}> = ({
  color,
  onPress,
}) => {
  const isLoading = useAppSelector(state => state.globalSettings.isLoggingOut);
  return (
    <Button
      style={$logOutButton}
      mode="text"
      loading={isLoading}
      textColor={color}
      onPress={onPress}>
      {isLoading ? '' : translate('common.logOut')}
    </Button>
  );
};

const $logOutButton: ViewStyle = {
  marginHorizontal: 16,
};

const $accountContainer: ViewStyle = {
  alignItems: 'center',
  gap: 16,
};
export default GlobalSettingsScreen;
