import React from 'react';
import {View, ViewStyle} from 'react-native';
import {IconButton, ProgressBar, Text, useTheme} from 'react-native-paper';
import {HeaderProps} from './types';
import {useSelector} from 'react-redux';
import {headerInfoSelector} from '../../redux-slice/selectors';

const Header: React.FC<HeaderProps> = ({action}) => {
  const selectHederInfo = useSelector(headerInfoSelector);
  const {roundness} = useTheme();
  return (
    <View>
      <View style={$upperContainer}>
        <IconButton
          size={26}
          icon="arrow-left"
          onPress={() => action({metadata: {type: 'back', value: {}}})}
        />
        <Text variant="headlineMedium">{selectHederInfo.listName}</Text>
      </View>
      <ProgressBar
        progress={selectHederInfo.progress}
        style={[$progressBar, {borderRadius: roundness}]}
      />
    </View>
  );
};

const $upperContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $progressBar: ViewStyle = {
  height: 8,
  margin: 16,
};

export default Header;
