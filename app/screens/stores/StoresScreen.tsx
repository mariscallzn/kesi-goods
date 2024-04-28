import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import {Button, Text, TextInput} from 'react-native-paper';
import {createOrUpdateStore, fetchStores} from './storesSlice';
import {FlatList} from 'react-native-gesture-handler';

const StoresScreen: FC<ShoppingStackScreenProps<'Stores'>> = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((root: RootState) => root.stores);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const [text, setText] = React.useState('');
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <TextInput
        label={'Name'}
        value={text}
        onChangeText={_text => setText(_text)}
      />
      <Button
        mode="contained"
        onPress={() => dispatch(createOrUpdateStore({id: '', name: text}))}>
        Add
      </Button>
      <FlatList
        data={selector.stores}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text variant="bodyLarge">{item.name}</Text>}
      />
    </Screen>
  );
};

export default StoresScreen;
