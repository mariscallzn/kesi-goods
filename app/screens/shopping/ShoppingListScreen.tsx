import React, {FC, useEffect} from 'react';
import {FAB} from 'react-native-paper';
import {ViewStyle} from 'react-native/types';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {Action, ActionCallback} from '../../inf/multiViewRenderer';
import {useAppDispatch} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import BottomSheetCoordinator from './components/bottom-sheet-coordinator/BottomSheetCoordinator';
import {bottomSheetTypes} from './components/bottom-sheet-coordinator/types';
import Content from './components/content/Content';
import {OnCheckPressType} from './components/content/types';
import Header from './components/header/Header';
import {
  fetchListInfo,
  handleToggle,
  openBottomSheet,
} from './redux-slice/shoppingListSlice';
import {CONTENT_ACTIONS} from './types';
import {AddOrUpdateBSMetadata} from './components/bottom-sheet-coordinator/types';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> = ({
  route,
  navigation,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchListInfo(route.params.listId));
  }, [dispatch, route]);

  const actions: ActionCallback = (action: Action) => {
    switch (action.metadata.type) {
      case CONTENT_ACTIONS.header.back:
        navigation.goBack();
        break;
      case CONTENT_ACTIONS.shoppingListItem.onCheckPress:
        const onCheckPressData = action.metadata.value as OnCheckPressType;
        dispatch(
          handleToggle({
            listId: route.params.listId,
            interaction: {
              checked: onCheckPressData.checked,
              itemId: onCheckPressData.itemId,
            },
          }),
        );
        break;
      case CONTENT_ACTIONS.shoppingListItem.onLongPress:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.addOrUpdateItem,
            value: {
              listId: route.params.listId,
              shoppingListItem: action.metadata.value,
            } as AddOrUpdateBSMetadata,
          }),
        );
        break;
      default:
        console.log(JSON.stringify(action));
        break;
    }
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Header action={actions} />
      <BottomSheetCoordinator maxHeight={50} action={actions} />
      <Content action={actions} />
      <FAB
        style={$fab}
        icon="plus"
        label={translate('ShoppingListScreen.AddOrUpdateBottomSheet.add')}
        onPress={() =>
          dispatch(
            openBottomSheet({
              type: bottomSheetTypes.addOrUpdateItem,
              value: {listId: route.params.listId} as AddOrUpdateBSMetadata,
            }),
          )
        }
      />
    </Screen>
  );
};

const $fab: ViewStyle = {
  position: 'absolute',
  margin: 16,
  right: 0,
  bottom: 0,
};

export default ShoppingListScreen;
