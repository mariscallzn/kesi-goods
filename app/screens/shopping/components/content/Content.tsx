import {View, ViewStyle} from 'react-native';
import React from 'react';
import {CUSTOM_VIEWS, ContentProps} from './types';
import {RootState, useAppSelector} from '../../../../redux/store';
import {FlatList} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import {multiViewRenderer} from '../../../../inf/multiViewRenderer';

const Content: React.FC<ContentProps> = ({action}) => {
  const selector = useAppSelector((root: RootState) => root.shopping);
  return selector.items.length > 0 ? (
    <FlatList
      contentContainerStyle={$flatList}
      data={selector.items}
      keyExtractor={item => item.id}
      // eslint-disable-next-line react/no-unstable-nested-components
      ItemSeparatorComponent={() => <View style={$itemSeparator} />}
      renderItem={({item}) =>
        multiViewRenderer(CUSTOM_VIEWS, {...item, action: action})
      }
    />
  ) : (
    <Text>TODO: Create empty component</Text>
  );
};

const $flatList: ViewStyle = {
  paddingBottom: 150,
};

const $itemSeparator: ViewStyle = {
  height: 16,
};

export default Content;
