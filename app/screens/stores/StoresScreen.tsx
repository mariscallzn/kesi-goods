import React, {FC, useEffect} from 'react';
import {Screen} from '../../components/Screen';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {ShoppingStackScreenProps} from '../../routes/ShoppingNavigator';
import {Button, Text, TextInput} from 'react-native-paper';
import {createOrUpdateStore, fetchStores} from './storesSlice';
import {FlatList} from 'react-native-gesture-handler';
import BottomSheet from '../../components/BottomSheet';
import {View} from 'react-native';

const StoresScreen: FC<ShoppingStackScreenProps<'Stores'>> = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((root: RootState) => root.stores);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const [text, setText] = React.useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = React.useState(false);
  return (
    <Screen safeAreaEdges={['top', 'bottom']}>
      <Button
        onPress={() => {
          setBottomSheetVisible(true);
        }}>
        Open
      </Button>
      <BottomSheet
        maxHeight={50}
        isVisible={isBottomSheetVisible}
        setIsVisible={setBottomSheetVisible}>
        <View>
          <TextInput
            label={'Name'}
            value={text}
            onChangeText={_text => setText(_text)}
          />
          <Button
            mode="contained"
            onPress={() => {
              setBottomSheetVisible(false);
              dispatch(createOrUpdateStore({id: '', name: text}));
            }}>
            Add
          </Button>
        </View>
      </BottomSheet>
      <FlatList
        data={selector.stores}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text variant="bodyLarge">{item.name}</Text>}
      />
    </Screen>
  );
};

export default StoresScreen;
