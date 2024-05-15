import React, {FC, useEffect} from 'react';
import {ViewStyle} from 'react-native/types';
import {Screen} from '../../components/Screen';
import {Action, ActionCallback} from '../../inf/multiViewRenderer';
import {useAppDispatch} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import BottomSheetCoordinator from './components/bottom-sheet-coordinator/BottomSheetCoordinator';
import {bottomSheetTypes} from './components/bottom-sheet-coordinator/types';
import Content from './components/content/Content';
import {ShoppingListNavigationMetadata} from './components/content/types';
import Footer from './components/footer/Footer';
import TopBar from './components/topbar/TopBar';
import {fetchStores, openBottomSheet} from './redux-slice/storesSlice';
import {CONTENT_ACTIONS} from './types';

const StoresScreen: FC<ShoppingStackScreenProps<'Stores'>> = ({navigation}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStores());
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

      default:
        break;
    }
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <TopBar />
      <BottomSheetCoordinator maxHeight={50} action={actions} />
      <Content action={actions} />
      <Footer style={$footer} />
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
