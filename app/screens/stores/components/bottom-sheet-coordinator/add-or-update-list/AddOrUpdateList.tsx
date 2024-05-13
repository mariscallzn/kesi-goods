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
import {AddOrUpdateListProps} from './types';
import {bottomSheetActions} from '../../../../../components/types';
import {Store} from '../../../../../model/types';

const AddOrUpdateList: React.FC<AddOrUpdateListProps> = props => {
  const {colors, roundness} = useTheme();
  const [listSuggestions, setListSuggestions] = React.useState<
    ListSuggestions | undefined
  >();

  const storesService = appComponent.storesService();
  const store: Store | undefined = props.metadata?.store;
  const isUpdating = store?.id && store.id !== '';

  const listNameRef = React.useRef<ControlledTextInputRef>(null);

  useEffect(() => {
    if (store) {
      listNameRef.current?.setText(store.name);
    } else {
      (async () =>
        setListSuggestions(await storesService.fetchListSuggestions()))();
    }
  }, [store, storesService]);

  return (
    <View>
      <GenericBottomSheetToolBar
        action={props.action}
        title={{
          key: props.metadata?.store
            ? 'StoreScreen.AddOrUpdateBottomSheet.renameList'
            : 'StoreScreen.AddOrUpdateBottomSheet.newList',
        }}
      />
      <ControlledTextInput
        //@ts-ignore
        ref={listNameRef}
        style={[$textInput, {borderRadius: roundness}]}
        placeholder={translate(
          props.metadata?.store
            ? 'StoreScreen.AddOrUpdateBottomSheet.renameList'
            : 'StoreScreen.AddOrUpdateBottomSheet.newList',
        )}
        autoFocus={true}
        underlineStyle={$textInputUnderLine}
      />
      {listSuggestions && (
        <>
          <Text style={$suggestionsText} variant="titleSmall">
            {translate('StoreScreen.AddOrUpdateBottomSheet.suggestions')}
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
        </>
      )}

      <Button
        style={$createButton}
        mode="contained"
        buttonColor={colors.backdrop}
        labelStyle={$createButtonLabel}
        onPress={() => {
          props.action({
            metadata: {
              type: isUpdating
                ? bottomSheetActions.update
                : bottomSheetActions.create,
              value: {
                id: store?.id ?? '',
                name: listNameRef.current?.getText(),
              } as Store,
            },
          });
        }}>
        {isUpdating
          ? translate('StoreScreen.AddOrUpdateBottomSheet.update')
          : translate('StoreScreen.AddOrUpdateBottomSheet.create')}
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

export default AddOrUpdateList;
