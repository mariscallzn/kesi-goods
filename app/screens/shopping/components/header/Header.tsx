import React from 'react';
import {View, ViewStyle} from 'react-native';
import {
  IconButton,
  ProgressBar,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {HeaderProps} from './types';
import {useSelector} from 'react-redux';
import {headerInfoSelector} from '../../redux-slice/selectors';
import {CONTENT_ACTIONS} from '../../types';
import {translate} from '../../../../i18n/translate';
import {useAppDispatch} from '../../../../redux/store';
import {search} from '../../redux-slice/shoppingListSlice';

const Header: React.FC<HeaderProps> = ({action, listId}) => {
  const selectHederInfo = useSelector(headerInfoSelector);
  const dispatch = useAppDispatch();
  const {roundness, colors} = useTheme();
  return (
    <View style={[$container, {backgroundColor: colors.background}]}>
      <View style={$upperContainer}>
        <IconButton
          size={26}
          icon="arrow-left"
          onPress={() =>
            action({
              metadata: {
                type: selectHederInfo.searchEnabled
                  ? CONTENT_ACTIONS.header.disableSearchMode
                  : CONTENT_ACTIONS.header.back,
                value: {},
              },
            })
          }
        />
        {selectHederInfo.searchEnabled ? (
          <Searchbar
            autoFocus
            style={$topBarTitle}
            placeholder={translate('common.search')}
            value={selectHederInfo.searchTerm ?? ''}
            onChangeText={e => {
              dispatch(search({term: e, listId: listId}));
            }}
          />
        ) : (
          <>
            <Text
              numberOfLines={1}
              lineBreakMode="tail"
              variant="headlineMedium"
              style={$topBarTitle}>
              {selectHederInfo.listName}
            </Text>
            <IconButton
              size={26}
              icon="dots-vertical"
              onPress={() =>
                action({
                  metadata: {type: CONTENT_ACTIONS.header.listMenu, value: {}},
                })
              }
            />
          </>
        )}
      </View>
      {!selectHederInfo.searchEnabled ? (
        <ProgressBar
          progress={selectHederInfo.progress}
          style={[$progressBar, {borderRadius: roundness}]}
        />
      ) : null}
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

const $progressBar: ViewStyle = {
  height: 8,
  marginHorizontal: 16,
  marginTop: 16,
};

export default Header;
