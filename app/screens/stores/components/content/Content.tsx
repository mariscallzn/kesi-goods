import React from 'react';
import {
  FlatList,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {multiViewRenderer} from '../../../../inf/multiViewRenderer';
import {RootState, useAppSelector} from '../../../../redux/store';
import {ContentProps, CUSTOM_VIEWS} from './types';
import {translate} from '../../../../i18n/translate';

const Content: React.FC<ContentProps> = ({action}) => {
  const selector = useAppSelector((root: RootState) => root.stores);
  const {colors} = useTheme();

  return selector.stores.length > 0 ? (
    <FlatList
      contentContainerStyle={$flatList}
      data={selector.stores}
      keyExtractor={item => item.id}
      // eslint-disable-next-line react/no-unstable-nested-components
      ItemSeparatorComponent={() => <View style={$itemSeparator} />}
      renderItem={({item}) =>
        multiViewRenderer(CUSTOM_VIEWS, {...item, action: action})
      }
    />
  ) : (
    <View style={$emptyContainer}>
      <Image
        style={[$emptyImage, {tintColor: colors.surfaceVariant}]}
        source={require('../../../../assets/empty_store_list.png')}
      />
      <Text
        style={[$emptyMessage, {color: colors.onBackground}]}
        variant="titleMedium">
        {translate('StoreScreen.emptyMessage')}
      </Text>
    </View>
  );
};

const $flatList: ViewStyle = {
  paddingBottom: 150,
};

const $itemSeparator: ViewStyle = {
  height: 16,
};

const $emptyContainer: ViewStyle = {
  margin: 32,
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const $emptyImage: ImageStyle = {
  width: '65%',
  height: '70%',
  resizeMode: 'contain',
};

const $emptyMessage: TextStyle = {
  textAlign: 'center',
};

export default Content;
