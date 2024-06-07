import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {HeaderProps} from './types';
import {CONTENT_ACTIONS} from '../../types';
import {useSelector} from 'react-redux';
import {goBackSelector} from '../../redux-slice/selectors';

const Header: React.FC<HeaderProps> = props => {
  const {colors} = useTheme();
  const goBackSelect = useSelector(goBackSelector);

  useEffect(() => {
    if (goBackSelect) {
      props.action({
        metadata: {
          type: CONTENT_ACTIONS.back,
          value: undefined,
        },
      });
    }
  }, [goBackSelect, props]);

  return (
    <View style={[$container, {backgroundColor: colors.background}]}>
      <IconButton
        size={26}
        icon="arrow-left"
        onPress={() =>
          props.action({
            metadata: {
              type: CONTENT_ACTIONS.back,
              value: undefined,
            },
          })
        }
      />
    </View>
  );
};

const $container: ViewStyle = {
  marginBottom: 16,
};

export default Header;
