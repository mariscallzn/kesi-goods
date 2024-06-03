import React from 'react';
import {View, ViewStyle} from 'react-native';
import {HeaderProps} from './types';
import {IconButton, Searchbar, useTheme} from 'react-native-paper';
import {CONTENT_ACTIONS} from '../../types';
import {translate} from '../../../../i18n/translate';
import {headerInfoSelector} from '../../redux-slice/selectors';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../../../redux/store';
import {search} from '../../redux-slice/productsSlice';

const Header: React.FC<HeaderProps> = ({action, listId}) => {
  const selectHederInfo = useSelector(headerInfoSelector);
  const dispatch = useAppDispatch();
  const {colors} = useTheme();
  return (
    <View style={[$container, {backgroundColor: colors.background}]}>
      <View style={$upperContainer}>
        <IconButton
          size={26}
          icon="arrow-left"
          onPress={() =>
            action({
              metadata: {
                type: CONTENT_ACTIONS.back,
                value: undefined,
              },
            })
          }
        />
        <Searchbar
          autoFocus
          style={$topBarTitle}
          placeholder={translate('common.search')}
          value={selectHederInfo.searchTerm ?? ''}
          onChangeText={e => {
            dispatch(search({term: e, listId: listId}));
          }}
        />
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  marginBottom: 16,
};

const $upperContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginEnd: 16,
};

const $topBarTitle: ViewStyle = {
  flex: 1,
};

export default Header;
