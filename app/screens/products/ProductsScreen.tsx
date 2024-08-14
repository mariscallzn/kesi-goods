import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {useAppDispatch} from '../../redux/store';
import Content from './components/content/Content';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import {cleanUp, initialize} from './redux-slice/productsSlice';
import {CONTENT_ACTIONS} from './types';
import {RootStackScreenProps} from '@/routes/RootNavigator';
import {Action} from '@/inf/types';

const ProductsScreen: FC<RootStackScreenProps<'Products'>> = ({
  route,
  navigation,
}) => {
  const dispatch = useAppDispatch();

  //#region UseEffects
  useEffect(() => {
    dispatch(initialize(route.params.listId));
    return () => {
      dispatch(cleanUp(route.params.listId));
    };
  }, [dispatch, route]);
  //#endregion

  //#region Actions
  const actions = (action: Action) => {
    switch (action.type) {
      case CONTENT_ACTIONS.back:
        navigation.goBack();
        break;

      default:
        break;
    }
  };
  //#endregion

  //#region Render
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Header action={actions} listId={route.params.listId} />
      <Content action={actions} listId={route.params.listId} />
      <Footer action={actions} listId={route.params.listId} />
    </Screen>
  );
  //#endregion
};

export default ProductsScreen;
