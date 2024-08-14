import AccountAvatar from '@/components/account-avatar/AccountAvatar';
import {translate} from '@/i18n/translate';
import {Action} from '@/inf/multiViewRenderer';
import {Store} from '@/model/types';
import {useAppDispatch, useAppSelector} from '@/redux/store';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {IconButton, Text, TouchableRipple} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {multiSelectionSelector} from '../../redux-slice/selectors';
import {
  copyList,
  markStoreListAsDelete,
  openBottomSheet,
  toggleMultiSelection,
} from '../../redux-slice/storesSlice';
import {bottomSheetTypes} from '../bottom-sheet-coordinator/types';
import MultiSelection from './MultiSelection';
import {TopBarPros, topBarActions} from './types';

const TopBar: React.FC<TopBarPros> = props => {
  const selectMultiSelection = useSelector(multiSelectionSelector);
  const dispatch = useAppDispatch();

  const actions = (action: Action) => {
    switch (action.metadata.type) {
      case topBarActions.close:
        dispatch(toggleMultiSelection(false));
        break;

      case topBarActions.edit:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.addOrUpdateList,
            value: action.metadata.value as Store,
          }),
        );
        actions({metadata: {type: topBarActions.close, value: undefined}});
        break;

      case topBarActions.copy:
        dispatch(
          copyList({
            stores: selectMultiSelection.selectedItems,
            copyOption: 'whole-list',
          }),
        );
        break;

      case topBarActions.delete:
        dispatch(markStoreListAsDelete(selectMultiSelection.selectedItems));
        break;

      default:
        props.action(action);
        break;
    }
  };

  return (
    <View style={[{...props}, $topBarContainer]}>
      {selectMultiSelection.isEnabled ? (
        <MultiSelection
          selectedItems={selectMultiSelection.selectedItems}
          action={action => actions(action)}
        />
      ) : (
        <View style={$greetingContainer}>
          <GreetingBanner />
          <SessionAvatar
            onPress={() => {
              actions({metadata: {type: topBarActions.settings, value: {}}});
            }}
          />
        </View>
      )}
    </View>
  );
};

const GreetingBanner = () => {
  const userSelect = useAppSelector(state => state.stores.user);
  return (
    <View style={$greetingBanner}>
      <Text variant="headlineSmall">
        {translate('StoreScreen.topBarTitle')}
      </Text>
      {userSelect && <Text variant="bodySmall">{userSelect.email}</Text>}
    </View>
  );
};

const $greetingBanner: ViewStyle = {
  flex: 1,
  gap: 2,
};

const SessionAvatar: React.FC<{onPress: () => void}> = ({onPress}) => {
  const userSelect = useAppSelector(state => state.stores.user);
  return userSelect ? (
    <TouchableRipple onPress={onPress}>
      <AccountAvatar size={32} user={userSelect} />
    </TouchableRipple>
  ) : (
    <IconButton icon="account-circle" size={32} onPress={onPress} />
  );
};

const $greetingContainer: ViewStyle = {
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const $topBarContainer: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  marginBottom: 16,
  marginStart: 24,
  marginEnd: 16,
};

export default TopBar;
