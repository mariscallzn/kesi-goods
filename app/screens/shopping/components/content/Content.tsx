import {Image, ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {CUSTOM_VIEWS, ContentProps} from './types';
import {RootState, useAppSelector} from '../../../../redux/store';
import {FlatList} from 'react-native-gesture-handler';
import {Text, useTheme} from 'react-native-paper';
import {multiViewRenderer} from '../../../../inf/multiViewRenderer';
import {translate} from '../../../../i18n/translate';

const Content: React.FC<ContentProps> = ({action}) => {
  const selector = useAppSelector((root: RootState) => root.shopping);
  const {colors} = useTheme();
  return selector.items.length > 0 ? (
    <FlatList
      contentContainerStyle={$flatList}
      data={selector.items}
      keyExtractor={item => item.id}
      renderItem={({item}) =>
        //@ts-ignore
        multiViewRenderer(CUSTOM_VIEWS, {...item, action: action})
      }
    />
  ) : (
    <View style={$emptyContainer}>
      <Image
        style={[$emptyImage, {tintColor: colors.surfaceVariant}]}
        source={require('../../../../assets/empty_list.png')}
      />
      <Text
        style={[$emptyMessage, {color: colors.onBackground}]}
        variant="titleMedium">
        {translate('ShoppingListScreen.emptyMessage')}
      </Text>
    </View>
  );
};

const $flatList: ViewStyle = {
  paddingBottom: 150,
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
