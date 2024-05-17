import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {Action, ActionCallback} from '../../inf/multiViewRenderer';
import {useAppDispatch} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import BottomSheetCoordinator from './components/bottom-sheet-coordinator/BottomSheetCoordinator';
import {
  AddOrUpdateBSMetadata,
  bottomSheetTypes,
} from './components/bottom-sheet-coordinator/types';
import Content from './components/content/Content';
import {OnCheckPressType} from './components/content/types';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import {
  fetchListInfo,
  handleToggle,
  openBottomSheet,
  toggleSearch,
} from './redux-slice/shoppingListSlice';
import {CONTENT_ACTIONS} from './types';
import {ViewStyle} from 'react-native';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> = ({
  route,
  navigation,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchListInfo({listId: route.params.listId}));
  }, [dispatch, route]);

  //#region Actions
  const actions: ActionCallback = (action: Action) => {
    switch (action.metadata.type) {
      case CONTENT_ACTIONS.header.back:
        navigation.goBack();
        break;

      case CONTENT_ACTIONS.header.disableSearchMode:
        dispatch(toggleSearch(false));
        dispatch(fetchListInfo({listId: route.params.listId}));
        break;

      case CONTENT_ACTIONS.header.listMenu:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.listMenu,
            value: undefined,
          }),
        );
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
  //#endregion

  //#region return Render
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Header action={actions} listId={route.params.listId} />
      <BottomSheetCoordinator maxHeight={50} action={actions} />
      <Content action={actions} />
      <Footer style={$footer} storeListId={route.params.listId} />
    </Screen>
  );
  //#endregion
};

const $footer: ViewStyle = {
  position: 'absolute',
  margin: 16,
  start: 0,
  end: 0,
  bottom: 0,
};

export default ShoppingListScreen;
