import React from 'react';
import {View, ViewStyle} from 'react-native';
import {
  IconButton,
  ProgressBar,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {UIStore} from '../../types';
const StoreItem: React.FC<UIStore> = ({store}) => {
  const {colors, roundness} = useTheme();

  const calculateProgress = (): number => {
    if (store.checkedItems && store.totalItems) {
      return store.checkedItems / store.totalItems;
    } else {
      return 0;
    }
  };

  return (
    <TouchableRipple
      borderless
      style={[$container, {borderRadius: roundness}]}
      onPress={() => {}}>
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
              animatedValue={calculateProgress()}
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
