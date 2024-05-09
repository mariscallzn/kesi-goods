import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {Action, ActionCallback} from '../../inf/multiViewRenderer';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import Content from './components/content/Content';
import Header from './components/header/Header';
import {useAppDispatch} from '../../redux/store';
import {fetchListInfo} from './redux-slice/asyncThunks';
import {FAB} from 'react-native-paper';
import {ViewStyle} from 'react-native/types';
import {translate} from '../../i18n/translate';
import {bottomSheetTypes} from './components/bottom-sheet-coordinator/types';
import {openBottomSheet} from './redux-slice/shoppingListSlice';
import BottomSheetCoordinator from './components/bottom-sheet-coordinator/BottomSheetCoordinator';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> = ({
  route,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchListInfo(route.params.listId));
  }, [dispatch, route]);

  const actions: ActionCallback = (action: Action) => {
    console.log(action.metadata.type);
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
              value: {listId: route.params.listId},
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
