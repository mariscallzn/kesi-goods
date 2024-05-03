import React, {FC, useEffect} from 'react';
import {FAB} from 'react-native-paper';
import {ViewStyle} from 'react-native/types';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {Action} from '../../inf/multiViewRenderer';
import {useAppDispatch} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import Content from './components/content/Content';
import BottomSheetCoordinator from './components/bottom-sheet-coordinator/BottomSheetCoordinator';
import {bottomSheetTypes} from './components/bottom-sheet-coordinator/types';
import TopBar from './components/topbar/TopBar';
import {fetchStores} from './redux-slice/asyncThunks';
import {openBottomSheet} from './redux-slice/storesSlice';

const StoresScreen: FC<ShoppingStackScreenProps<'Stores'>> = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const actions = (action: Action) => {
    console.log(action.metadata.value);
  };

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <TopBar />
      <BottomSheetCoordinator maxHeight={50} action={actions} />
      <Content action={actions} />
      <FAB
        style={$fab}
        icon="plus"
        label={translate('StoreScreen.addList')}
        onPress={() =>
          dispatch(
            openBottomSheet({
              type: bottomSheetTypes.create,
              value: {},
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

export default StoresScreen;
