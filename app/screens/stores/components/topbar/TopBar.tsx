import {View, ViewStyle} from 'react-native';
import React from 'react';
import {translate} from '../../../../i18n/translate';
import {Text} from 'react-native-paper';
import {TopBarPros} from './types';

const TopBar: React.FC<TopBarPros> = props => {
  return (
    <View style={[{...props}, $topBarContainer]}>
      <Text variant="titleLarge">{translate('StoreScreen.topBarTitle')}</Text>
    </View>
  );
};

const $topBarContainer: ViewStyle = {
  flexDirection: 'column',
  padding: 16,
  justifyContent: 'center',
};

export default TopBar;
