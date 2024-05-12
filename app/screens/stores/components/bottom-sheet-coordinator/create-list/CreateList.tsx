import React, {useEffect} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Chip, Text, useTheme} from 'react-native-paper';
import ControlledTextInput, {
  ControlledTextInputRef,
} from '../../../../../components/ControlledTextInput';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import {appComponent} from '../../../../../di/appComponent';
import {translate} from '../../../../../i18n/translate';
import {ListSuggestions} from '../../../types';
import {CreateListProps} from './types';
import {bottomSheetActions} from '../../../../../components/types';

const CreateList: React.FC<CreateListProps> = props => {
  const storesService = appComponent.storesService();
  const {colors, roundness} = useTheme();
  const [listSuggestions, setListSuggestions] = React.useState<
    ListSuggestions | undefined
  >();

  const listNameRef = React.useRef<ControlledTextInputRef>(null);

  useEffect(() => {
    (async () =>
      setListSuggestions(await storesService.fetchListSuggestions()))();
  }, [storesService]);

  return (
    <View>
      <GenericBottomSheetToolBar
        action={props.action}
        title={{key: 'StoreScreen.CreateBottomSheet.newList'}}
      />
      <ControlledTextInput
        //@ts-ignore
        ref={listNameRef}
        style={[$textInput, {borderRadius: roundness}]}
        placeholder={translate('StoreScreen.CreateBottomSheet.newList')}
        autoFocus={true}
        underlineStyle={$textInputUnderLine}
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
          <Chip
            style={$suggestionChip}
            onPress={() => listNameRef.current?.setText(item)}>
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
          <Chip
            style={$suggestionChip}
            onPress={() => listNameRef.current?.setText(item)}>
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
            metadata: {
              type: bottomSheetActions.create,
              value: listNameRef.current?.getText(),
            },
          });
        }}>
        {translate('StoreScreen.CreateBottomSheet.create')}
      </Button>
    </View>
  );
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
