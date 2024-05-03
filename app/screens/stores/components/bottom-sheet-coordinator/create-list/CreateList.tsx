import React, {useEffect} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  Button,
  Chip,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {appComponent} from '../../../../../di/appComponent';
import {translate} from '../../../../../i18n/translate';
import {ListSuggestions} from '../../../types';
import {bottomSheetTypes} from '../types';
import {CreateListProps} from './types';

const CreateList: React.FC<CreateListProps> = props => {
  const storesService = appComponent.storesService();
  const {colors, roundness} = useTheme();

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
      <View style={$topBar}>
        <Text variant="titleLarge" style={$topBarTitle}>
          {translate('StoreScreen.CreateBottomSheet.createList')}
        </Text>
        <IconButton
          icon={'close'}
          size={18}
          iconColor={colors.onSurfaceDisabled}
          containerColor={colors.backdrop}
          onPress={() => props.action({metadata: {type: 'close', value: {}}})}
        />
      </View>
      <TextInput
        placeholder={translate('StoreScreen.CreateBottomSheet.newList')}
        autoFocus={true}
        style={[$textInput, {borderRadius: roundness}]}
        underlineStyle={$textInputUnderLine}
        value={text}
        onChangeText={setText}
      />
      <Text style={$suggestionsText} variant="titleSmall">
        {translate('StoreScreen.CreateBottomSheet.suggestions')}
      </Text>

      <FlatList
        contentContainerStyle={$flatList}
        data={listSuggestions?.misc}
        keyboardShouldPersistTaps={'always'}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={$chipsSeparator} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Chip style={$suggestionChip} onPress={() => setText(item)}>
            {item}
          </Chip>
        )}
      />

      <FlatList
        contentContainerStyle={$flatList}
        data={listSuggestions?.stores}
        keyboardShouldPersistTaps={'always'}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={$chipsSeparator} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Chip style={$suggestionChip} onPress={() => setText(item)}>
            {item}
          </Chip>
        )}
      />

      <Button
        style={$createButton}
        mode="contained"
        buttonColor={colors.backdrop}
        labelStyle={$createButtonLabel}
        onPress={() => {
          props.action({
            metadata: {type: bottomSheetTypes.create, value: text},
          });
        }}>
        {translate('StoreScreen.CreateBottomSheet.create')}
      </Button>
    </View>
  );
};

const $topBar: ViewStyle = {
  flexDirection: 'row',
  marginHorizontal: 16,
  marginBottom: 16,
  alignItems: 'center',
};

const $topBarTitle: ViewStyle = {
  flex: 1,
};

const $textInput: ViewStyle = {
  marginHorizontal: 16,
};

const $textInputUnderLine: ViewStyle = {
  backgroundColor: 'transparent',
};

const $suggestionsText: ViewStyle = {
  marginHorizontal: 16,
  marginTop: 32,
  marginBottom: 8,
};

const $suggestionChip: ViewStyle = {
  marginVertical: 8,
};

const $chipsSeparator: ViewStyle = {
  width: 12,
};

const $flatList: ViewStyle = {
  paddingHorizontal: 16,
};

const $createButton: ViewStyle = {
  margin: 16,
};

const $createButtonLabel: TextStyle = {
  fontSize: 16,
};

export default CreateList;
