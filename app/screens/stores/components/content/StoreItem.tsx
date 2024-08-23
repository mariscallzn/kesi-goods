import React, {memo, useEffect, useState} from 'react';
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
import {safeDivision} from '@/utils/misc';

const StoreItem: React.FC<UIStore> = ({
  store,
  multiSelectionEnabled,
  action,
}) => {
  const {colors, roundness} = useTheme();

  const [isSelected, setSelected] = useState(multiSelectionEnabled);

  useEffect(() => {
    if (!multiSelectionEnabled) {
      setSelected(false);
    }
  }, [multiSelectionEnabled]);

  return (
    <TouchableRipple
      borderless
      style={[$container, {borderRadius: roundness}]}
      onLongPress={() => {
        setSelected(true);
        action?.({
          metadata: {
            type: CONTENT_ACTIONS.enableMultiSelection,
            value: store,
          },
        });
      }}
      onPress={() => {
        if (multiSelectionEnabled) {
          const _isSelected = isSelected;
          setSelected(!_isSelected);
          action?.({
            metadata: {
              type: !_isSelected
                ? CONTENT_ACTIONS.itemSelected
                : CONTENT_ACTIONS.itemUnselected,
              value: store,
            },
          });
        } else {
          action?.({
            metadata: {
              type: CONTENT_ACTIONS.navigateToShoppingList,
              value: {
                route: 'ShoppingList',
                storeId: store.id,
              } as ShoppingListNavigationMetadata,
            },
          });
        }
      }}>
      <View
        style={[
          multiSelectionEnabled && isSelected
            ? {
                ...$multiSelectionContainer,
                borderColor: colors.primary,
              }
            : undefined,
          {backgroundColor: colors.surfaceVariant, borderRadius: roundness},
        ]}>
        <View style={$upperSection}>
          <Text
            style={[$title, {color: colors.onSurfaceVariant}]}
            variant="headlineSmall">
            {store.name}
          </Text>
          <IconButton
            icon={
              multiSelectionEnabled && !isSelected
                ? 'circle-outline'
                : isSelected
                ? 'check-circle'
                : 'dots-vertical'
            }
            iconColor={isSelected ? colors.primary : colors.onSurfaceVariant}
            onPress={() => {
              if (multiSelectionEnabled) {
                setSelected(!isSelected);
              } else {
                action?.({
                  metadata: {type: CONTENT_ACTIONS.itemMenu, value: store},
                });
              }
            }}
          />
        </View>
        <View style={$bottomContainer}>
          <View style={$progressContainer}>
            <ProgressBar
              style={[
                $progressBar,
                {
                  borderRadius: roundness,
                  backgroundColor: colors.surface,
                },
              ]}
              animatedValue={safeDivision(store.checkedItems, store.totalItems)}
            />
          </View>
          <Text variant="titleMedium" style={{color: colors.onSurfaceVariant}}>
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

const $multiSelectionContainer: ViewStyle = {
  borderWidth: 4,
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

const shallowEqual = (a: UIStore, b: UIStore) => {
  return a.id === b.id && a.multiSelectionEnabled === b.multiSelectionEnabled;
};

export default memo(StoreItem, shallowEqual);
