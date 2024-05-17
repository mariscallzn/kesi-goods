import React from 'react';
import {View, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {translate} from '../../../../i18n/translate';
import {Action} from '../../../../inf/multiViewRenderer';
import {useAppDispatch} from '../../../../redux/store';
import {multiSelectionSelector} from '../../redux-slice/selectors';
import {
  markStoreListAsDelete,
  openBottomSheet,
  toggleMultiSelection,
} from '../../redux-slice/storesSlice';
import MultiSelection from './MultiSelection';
import {TopBarPros, topBarActions} from './types';
import {bottomSheetTypes} from '../bottom-sheet-coordinator/types';
import {Store} from '../../../../model/types';

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
        //TODO:
        break;
      case topBarActions.delete:
        dispatch(markStoreListAsDelete(selectMultiSelection.selectedItems));
        break;

      default:
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
        <Text style={$greetings} variant="titleLarge">
          {translate('StoreScreen.topBarTitle')}
        </Text>
      )}
    </View>
  );
};

const $topBarContainer: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
};

const $greetings: ViewStyle = {
  margin: 16,
};

export default TopBar;
