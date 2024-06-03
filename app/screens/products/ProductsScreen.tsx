import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {Action} from '../../inf/multiViewRenderer';
import {useAppDispatch} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import Content from './components/content/Content';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import {cleanUp, initialize} from './redux-slice/productsSlice';
import {CONTENT_ACTIONS} from './types';

const ProductsScreen: FC<ShoppingStackScreenProps<'Products'>> = ({
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
    switch (action.metadata.type) {
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
