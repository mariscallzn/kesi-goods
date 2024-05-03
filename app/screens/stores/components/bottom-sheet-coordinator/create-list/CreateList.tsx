import React, {useEffect} from 'react';
import {appComponent} from '../../../../../di/appComponent';
import {CreateListProps} from './types';
import {ListSuggestions} from '../../../types';
import {View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {bottomSheetTypes} from '../types';
import {translate} from '../../../../../i18n/translate';

const CreateList: React.FC<CreateListProps> = props => {
  const storesService = appComponent.storesService();

  const [text, setText] = React.useState<string>('');
  const [listSuggestions, setListSuggestions] = React.useState<
    ListSuggestions | undefined
  >();

  useEffect(() => {
    (async () =>
      setListSuggestions(await storesService.fetchListSuggestions()))();
  }, [storesService]);

  return (
    <View>
      <TextInput value={text} onChangeText={setText} />
      <Button
        onPress={() => {
          props.action({
            metadata: {type: bottomSheetTypes.create, value: text},
          });
        }}>
        {translate('StoreScreen.CreateBottomSheet.create')}
      </Button>
      {listSuggestions?.stores.map(s => (
        <Text key={s}>{s}</Text>
      ))}
    </View>
  );
};

export default CreateList;
