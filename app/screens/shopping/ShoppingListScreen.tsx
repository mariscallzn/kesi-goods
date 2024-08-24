import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {Action, ActionCallback} from '../../inf/multiViewRenderer';
import {useAppDispatch} from '../../redux/store';
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
  resetState,
  toggleSearch,
} from './redux-slice/shoppingListSlice';
import {CONTENT_ACTIONS} from './types';
import {ViewStyle} from 'react-native';
import {RootStackScreenProps} from '@/routes/RootNavigator';
import {generateClient} from 'aws-amplify/data';
import {type Schema} from 'amplify/data/resource';
import {logger} from '@/utils/misc';

const ShoppingListScreen: FC<RootStackScreenProps<'ShoppingList'>> = ({
  route,
  navigation,
}) => {
  const awsClient = generateClient<Schema>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchListInfo({listId: route.params.store.id}));
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, route]);

  useEffect(() => {
    if (route.params.store.cloudId) {
      const sub = awsClient.models.Item.observeQuery({
        filter: {
          listId: {
            eq: route.params.store.cloudId,
          },
        },
      }).subscribe({
        next: ({isSynced, items}) => {
          if (isSynced) {
            logger(items, 'Subs Items');
            // dispatch();
          }
        },
      });
      return () => sub.unsubscribe();
    }
  }, [awsClient, route.params]);

  //#region Actions
  const actions: ActionCallback = (action: Action) => {
    switch (action.metadata.type) {
      case CONTENT_ACTIONS.header.back:
        navigation.goBack();
        break;

      case CONTENT_ACTIONS.header.navigateToProducts:
        navigation.navigate('Products', {store: route.params.store});
        break;

      case CONTENT_ACTIONS.header.disableSearchMode:
        dispatch(toggleSearch(false));
        dispatch(fetchListInfo({listId: route.params.store.id}));
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
            listId: route.params.store.id,
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
              listId: route.params.store.id,
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
      <Header action={actions} listId={route.params.store.id} />
      <BottomSheetCoordinator
        maxHeight={85}
        action={actions}
        storeId={route.params.store.id}
      />
      <Content action={actions} />
      <Footer
        style={$footer}
        action={actions}
        storeListId={route.params.store.id}
      />
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
