import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Chip, Text, useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import ControlledTextInput from '../../../../components/ControlledTextInput';
import {translate} from '../../../../i18n/translate';
import {suggestionSelector} from '../../redux-slice/selectors';
import {ContentProps} from './types';
import {useAppDispatch} from '../../../../redux/store';
import {fetchSuggestions} from '../../redux-slice/addStoreSlice';

const Content: React.FC<ContentProps> = props => {
  const dispatch = useAppDispatch();
  const {roundness} = useTheme();
  const suggestionSelect = useSelector(suggestionSelector);

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  return (
    <View {...props}>
      <ControlledTextInput
        //@ts-ignore
        ref={props.nameRef}
        style={[$textInput, {borderRadius: roundness}]}
        placeholder={translate('StoreScreen.UpdateBottomSheet.newList')}
        autoFocus={true}
        underlineStyle={$textInputUnderLine}
      />
      <Text style={$suggestionsText} variant="titleSmall">
        {translate('StoreScreen.UpdateBottomSheet.suggestions')}
      </Text>
      <FlatList
        contentContainerStyle={$flatList}
        data={suggestionSelect.stores}
        keyboardShouldPersistTaps={'always'}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={$chipsSeparator} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Chip
            style={$suggestionChip}
            onPress={() => props.nameRef.current?.setText(item)}>
            {item}
          </Chip>
        )}
      />
      <FlatList
        contentContainerStyle={$flatList}
        data={suggestionSelect.misc}
        keyboardShouldPersistTaps={'always'}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={$chipsSeparator} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Chip
            style={$suggestionChip}
            onPress={() => props.nameRef.current?.setText(item)}>
            {item}
          </Chip>
        )}
      />
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

const $flatList: ViewStyle = {
  paddingHorizontal: 16,
};

const $chipsSeparator: ViewStyle = {
  width: 12,
};

const $suggestionChip: ViewStyle = {
  marginVertical: 8,
};

export default Content;
