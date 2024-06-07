import React, {useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import Content from './components/content/Content';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import {ControlledTextInputRef} from '../../components/ControlledTextInput';
import {useAppDispatch} from '../../redux/store';
import {createList, resetState} from './redux-slice/addStoreSlice';

const AddStoreScreen: React.FC<ShoppingStackScreenProps<'AddStore'>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const listNameRef = React.useRef<ControlledTextInputRef>(null);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Header action={_ => navigation.goBack()} />
      <Content nameRef={listNameRef} />
      <Footer
        action={() =>
          dispatch(
            createList({id: 'n/a', name: listNameRef.current?.getText() ?? ''}),
          )
        }
      />
    </Screen>
  );
};

export default AddStoreScreen;
