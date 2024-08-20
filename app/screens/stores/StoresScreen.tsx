import {RootStackScreenProps} from '@/routes/RootNavigator';
import React, {FC, useEffect} from 'react';
import {ViewStyle} from 'react-native/types';
import {Screen} from '../../components/Screen';
import {Action, ActionCallback} from '../../inf/multiViewRenderer';
import {Store} from '../../model/types';
import {useAppDispatch} from '../../redux/store';
import BottomSheetCoordinator from './components/bottom-sheet-coordinator/BottomSheetCoordinator';
import {bottomSheetTypes} from './components/bottom-sheet-coordinator/types';
import Content from './components/content/Content';
import {ShoppingListNavigationMetadata} from './components/content/types';
import Footer from './components/footer/Footer';
import TopBar from './components/topbar/TopBar';
import {
  addOrRemoveSelection,
  syncUp,
  openBottomSheet,
  toggleMultiSelection,
} from './redux-slice/storesSlice';
import {CONTENT_ACTIONS} from './types';
import {topBarActions} from './components/topbar/types';
import {bottomSheetActions} from '@/components/types';

const StoresScreen: FC<RootStackScreenProps<'Stores'>> = ({navigation}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(syncUp());
  }, [dispatch]);

  const actions: ActionCallback = (action: Action) => {
    switch (action.metadata.type) {
      case CONTENT_ACTIONS.navigateToShoppingList:
        const shoppingListMetadata = action.metadata
          .value as ShoppingListNavigationMetadata;

        //@ts-expect-error
        navigation.navigate(shoppingListMetadata.route, {
          listId: shoppingListMetadata.storeId,
        });
        break;

      case CONTENT_ACTIONS.itemMenu:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.openItemMenu,
            value: action.metadata.value,
          }),
        );
        break;

      case CONTENT_ACTIONS.enableMultiSelection:
        dispatch(toggleMultiSelection(true));
        dispatch(
          addOrRemoveSelection({
            addOrRemove: 'add',
            store: action.metadata.value as Store,
          }),
        );
        break;
      case CONTENT_ACTIONS.itemSelected:
        dispatch(
          addOrRemoveSelection({
            addOrRemove: 'add',
            store: action.metadata.value as Store,
          }),
        );
        break;
      case CONTENT_ACTIONS.itemUnselected:
        dispatch(
          addOrRemoveSelection({
            addOrRemove: 'remove',
            store: action.metadata.value as Store,
          }),
        );
        break;

      case CONTENT_ACTIONS.addStoreScreen:
        navigation.navigate('AddStore');
        break;

      case topBarActions.settings:
        navigation.navigate('GlobalSettings');
        break;

      case bottomSheetActions.login:
        navigation.navigate('Login');
        break;

      default:
        break;
    }
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <TopBar action={actions} />
      <BottomSheetCoordinator maxHeight={50} action={actions} />
      <Content action={actions} />
      <Footer action={actions} style={$footer} />
    </Screen>
  );
};

const $footer: ViewStyle = {
  position: 'absolute',
  margin: 16,
  start: 0,
  end: 0,
  bottom: 0,
};

export default StoresScreen;
