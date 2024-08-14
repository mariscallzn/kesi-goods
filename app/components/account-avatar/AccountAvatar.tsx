import {TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {AccountAvatarProps} from './types';
import {darkenColor, getRandomColor} from '@/utils/misc';

const AccountAvatar: React.FC<AccountAvatarProps> = props => {
  const circleColor = getRandomColor();
  const textColor = darkenColor(circleColor, 80);
  const initial = props.user.email.charAt(0).toUpperCase();

  return (
    <View
      style={[
        $circle,
        {
          backgroundColor: circleColor,
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2,
        },
      ]}>
      <Text style={[$text, {fontSize: props.size / 2, color: textColor}]}>
        {initial}
      </Text>
    </View>
  );
};

const $circle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

const $text: TextStyle = {
  textAlign: 'center',
};

export default AccountAvatar;
