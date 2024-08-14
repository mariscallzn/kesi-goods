import React from 'react';
import {View, ViewStyle} from 'react-native';
import {HeaderProps} from './types';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {translate} from '@/i18n/translate';

const Header: React.FC<HeaderProps> = ({goBack}) => {
  const {colors} = useTheme();
  return (
    <View style={[$container, {backgroundColor: colors.background}]}>
      <IconButton size={26} icon="arrow-left" onPress={() => goBack()} />
      <Text
        numberOfLines={1}
        lineBreakMode="tail"
        variant="headlineMedium"
        style={$topBarTitle}>
        {translate('common.settings')}
      </Text>
    </View>
  );
};

const $topBarTitle: ViewStyle = {
  flex: 1,
};

const $container: ViewStyle = {
  marginBottom: 16,
  flexDirection: 'row',
  alignItems: 'center',
};

export default Header;
