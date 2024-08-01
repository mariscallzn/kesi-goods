import React, {memo, useState} from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  Chip,
  Divider,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {translate} from '../../../../i18n/translate';
import {Category} from '../../../../model/types';
import {PRODUCT_ITEM_ACTION, UIProduct} from '../../types';
import {CategoryProps} from './types';

//#region Product Item
const ProductItem: React.FC<UIProduct> = props => {
  const {colors} = useTheme();
  const [isExpanded, setExpanded] = useState(false);
  const [isAdded, setAdded] = useState((props.quantity ?? 0) >= 1);
  const [quantity, setQuantity] = useState(props.quantity ?? 0);
  const [unit, setUnit] = useState<string | undefined>(props.selectedUnit);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(props.selectedCategory);
  const isMoreThanOne = quantity > 1;

  const action = (updatedItem: UIProduct) => {
    props.action?.({type: PRODUCT_ITEM_ACTION.update, value: updatedItem});
  };

  return (
    <Pressable
      onPress={isAdded ? () => setExpanded(!isExpanded) : undefined}
      style={$container}>
      <>
        <View style={$upperContainer}>
          <View
            style={[
              $categoryIndicator,
              {
                backgroundColor:
                  isExpanded || !isAdded ? undefined : selectedCategory?.color,
              },
            ]}
          />
          <IconButton
            style={$iconButton}
            size={32}
            iconColor={
              props.checked
                ? 'green'
                : isAdded
                ? colors.primary
                : colors.surfaceVariant
            }
            icon={props.checked ? 'check' : 'plus-circle'}
            onPress={() => {
              if (quantity === 0) {
                setAdded(true);
              }

              const total = quantity + 1;
              setQuantity(total);
              action({
                ...props,
                checked: false,
                quantity: total,
                selectedUnit: unit,
                selectedCategory: selectedCategory,
                action: undefined,
              });
            }}
          />
          <Text style={$productName} variant="bodyLarge">
            {props.product.name}
          </Text>
          {!props.checked && isAdded && (
            <View style={$infoDeleteContainer}>
              {isMoreThanOne || unit ? (
                <Text variant="titleMedium" style={{color: colors.tertiary}}>
                  {`${quantity}${unit ? unit : ''}`}
                </Text>
              ) : null}
              <IconButton
                style={$iconButton}
                size={24}
                iconColor={colors.error}
                icon={isMoreThanOne ? 'minus' : 'close'}
                onPress={() => {
                  if (isMoreThanOne) {
                    const total = quantity - 1;
                    setQuantity(total);
                    action({
                      ...props,
                      quantity: total,
                      selectedUnit: unit,
                      selectedCategory: selectedCategory,
                      action: undefined,
                    });
                  } else {
                    setSelectedCategory(props.selectedCategory);
                    setQuantity(0);
                    setAdded(false);
                    action({
                      ...props,
                      quantity: undefined,
                      selectedUnit: unit,
                      selectedCategory: props.selectedCategory,
                      action: undefined,
                    });
                  }
                }}
              />
              <IconButton
                style={$iconButton}
                size={24}
                iconColor={colors.tertiary}
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                onPress={() => {
                  setExpanded(!isExpanded);
                }}
              />
            </View>
          )}
        </View>
        {isAdded && isExpanded && (
          <View style={$bottomContainer}>
            <FlatList
              contentContainerStyle={$flatListContentContainer}
              horizontal
              keyboardShouldPersistTaps="always"
              data={props.categories}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <CategoryItem
                  category={item}
                  isSelected={selectedCategory?.id === item.id}
                  onCategoryPress={category => {
                    setSelectedCategory(
                      selectedCategory?.id === category.id
                        ? undefined
                        : category,
                    );
                    action({
                      ...props,
                      quantity: quantity,
                      selectedUnit: unit,
                      selectedCategory:
                        selectedCategory?.id === category.id
                          ? undefined
                          : category,
                      action: undefined,
                    });
                  }}
                />
              )}
              // eslint-disable-next-line react/no-unstable-nested-components
              ItemSeparatorComponent={() => <View style={$itemSeparator} />}
            />
            <View style={$unitsContainer}>
              <Text style={$unitText} variant="labelMedium">
                {translate('ShoppingListScreen.UpdateBottomSheet.unitCP')}
              </Text>
              {props.units?.map(_unit => (
                <Chip
                  style={$chip}
                  key={_unit}
                  mode="flat"
                  onPress={() => {
                    const result = _unit === unit ? undefined : _unit;
                    setUnit(result);
                    action({
                      ...props,
                      selectedUnit: result,
                      quantity: quantity,
                      selectedCategory: selectedCategory,
                      action: undefined,
                    });
                  }}>
                  {_unit}
                </Chip>
              ))}
            </View>
          </View>
        )}
        <Divider />
      </>
    </Pressable>
  );
};

const $container: ViewStyle = {
  flex: 1,
};

const $iconButton: ViewStyle = {
  margin: 0,
};

const $categoryIndicator: ViewStyle = {
  width: 4,
  height: '100%',
};

const $upperContainer: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const $bottomContainer: ViewStyle = {
  flex: 1,
};

const $infoDeleteContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginEnd: 8,
};

const $productName: ViewStyle = {
  flex: 1,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: 16,
};

const $itemSeparator: ViewStyle = {
  width: 8,
};

const $unitsContainer: ViewStyle = {
  flexDirection: 'row',
  margin: 16,
  alignItems: 'center',
};

const $unitText: ViewStyle = {
  marginEnd: 4,
};

const $chip: ViewStyle = {
  marginHorizontal: 4,
  borderRadius: 8,
};
//#endregion

//#region Category Item
const CategoryItem: React.FC<CategoryProps> = props => {
  const {colors} = useTheme();

  return (
    <TouchableRipple
      borderless
      style={$categoryContainer}
      onPress={() => {
        props.onCategoryPress(props.category);
      }}>
      <View
        style={[$categoryContainer, {backgroundColor: props.category.color}]}>
        <View
          style={
            props.isSelected
              ? {
                  ...$selectedCategoryBorder,
                  borderColor: colors.background,
                }
              : undefined
          }
        />
      </View>
    </TouchableRipple>
  );
};

const $categoryContainer: ViewStyle = {
  borderRadius: 8,
  height: 32,
  width: 32,
  alignItems: 'center',
  justifyContent: 'center',
};

const $selectedCategoryBorder: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  height: 28,
  width: 28,
  borderRadius: 6,
  backgroundColor: 'transparent',
  borderWidth: 5,
};
//#endregion

const shallowEqual = (a: UIProduct, b: UIProduct) => {
  return a.id === b.id;
};

export default memo(ProductItem, shallowEqual);
