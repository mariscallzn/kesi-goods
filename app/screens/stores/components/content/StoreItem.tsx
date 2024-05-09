import React from 'react';
import {View, ViewStyle} from 'react-native';
import {
  IconButton,
  ProgressBar,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {CONTENT_ACTIONS, UIStore} from '../../types';
import {ShoppingListNavigationMetadata} from './types';
import {saveDivision} from '../../../../utils/misc';

const StoreItem: React.FC<UIStore> = ({store, action}) => {
  const {colors, roundness} = useTheme();

  return (
    <TouchableRipple
      borderless
      style={[$container, {borderRadius: roundness}]}
      onPress={() => {
        action?.({
          metadata: {
            type: CONTENT_ACTIONS.navigateToShoppingList,
            value: {
              route: 'ShoppingList',
              storeId: store.id,
            } as ShoppingListNavigationMetadata,
          },
        });
      }}>
      <View style={{backgroundColor: colors.backdrop}}>
        <View style={$upperSection}>
          <Text style={$title} variant="headlineSmall">
            {store.name}
          </Text>
          <IconButton icon={'dots-vertical'} onPress={() => {}} />
        </View>
        <View style={$bottomContainer}>
          <View style={$progressContainer}>
            <ProgressBar
              style={[$progressBar, {borderRadius: roundness}]}
              theme={{colors: {primary: 'green'}}}
              animatedValue={saveDivision(store.checkedItems, store.totalItems)}
            />
          </View>
          <Text variant="titleMedium">
            {store.checkedItems}/{store.totalItems}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

const $container: ViewStyle = {
  marginHorizontal: 16,
};

const $upperSection: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const $bottomContainer: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 16,
  flexDirection: 'row',
  alignItems: 'center',
};

const $title: ViewStyle = {
  flex: 1,
  marginStart: 16,
};

const $progressBar: ViewStyle = {
  height: 8,
};

const $progressContainer: ViewStyle = {
  flex: 1,
  marginEnd: 16,
};

export default StoreItem;
