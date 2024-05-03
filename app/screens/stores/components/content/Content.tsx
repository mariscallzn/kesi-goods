import React from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import {multiViewRenderer} from '../../../../inf/multiViewRenderer';
import {RootState, useAppSelector} from '../../../../redux/store';
import {ScreenContentProps, CUSTOM_VIEWS} from './types';

const Content: React.FC<ScreenContentProps> = ({action}) => {
  const selector = useAppSelector((root: RootState) => root.stores);

  return selector.stores.length > 0 ? (
    <FlatList
      data={selector.stores}
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

const $itemSeparator: ViewStyle = {
  height: 16,
};

export default Content;
