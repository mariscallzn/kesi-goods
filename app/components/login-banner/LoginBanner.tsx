import {View, ViewStyle} from 'react-native';
import React from 'react';
import {LoginBannerProps} from './types';
import {Icon, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {translate} from '@/i18n/translate';

const LoginBanner: React.FC<LoginBannerProps> = ({onPress}) => {
  const {colors} = useTheme();
  return (
    <TouchableRipple
      style={[$loginContainer, {backgroundColor: colors.surfaceVariant}]}
      onPress={onPress}>
      <View style={$innerLoginContainer}>
        <View>
          <Text variant="titleMedium" style={{color: colors.primary}}>
            {translate('common.logIn').toUpperCase()}
          </Text>
          <Text variant="bodySmall" style={{color: colors.primary}}>
            {translate('common.loginMessage')}
          </Text>
        </View>
        <Icon size={32} source={'chevron-right'} color={colors.primary} />
      </View>
    </TouchableRipple>
  );
};

const $loginContainer: ViewStyle = {
  marginHorizontal: 16,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
  gap: 2,
};

const $innerLoginContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default LoginBanner;
