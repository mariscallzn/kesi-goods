import React, {useEffect} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {translate} from '../../../../../i18n/translate';
import {ShoppingListItem} from '../../../../../model/types';
import Categories, {CategoriesRef} from './Categories';
import Header, {HeaderRef} from './Header';
import QuantityUnit, {QuantityUnitRef} from './QuantityUnit';
import {AddOrUpdateItemProps} from './types';
import {bottomSheetActions} from '../../../../../components/types';

const AddOrUpdateItem: React.FC<AddOrUpdateItemProps> = props => {
  const shoppingListItem = props.metadata?.shoppingListItem;
  const units = props.metadata?.units;
  const isUpdating =
    props.metadata?.shoppingListItem?.id &&
    props.metadata?.shoppingListItem?.id !== '';
  const theme = useTheme();

  const headerRef = React.useRef<HeaderRef>(null);
  const quantityUnitRef = React.useRef<QuantityUnitRef>(null);
  const categoryRef = React.useRef<CategoriesRef>(null);

  useEffect(() => {
    headerRef.current?.setProduct(shoppingListItem?.product);
    quantityUnitRef.current?.setQuantity(shoppingListItem?.quantity);
    quantityUnitRef.current?.setUnit(shoppingListItem?.unit);
    categoryRef.current?.setCategory(shoppingListItem?.category);
  }, [shoppingListItem]);

  return (
    <View>
      <Header
        //@ts-ignore
        ref={headerRef}
        theme={theme}
        action={props.action}
      />
      <QuantityUnit
        //@ts-ignore
        ref={quantityUnitRef}
        theme={theme}
        units={units}
      />
      <Categories
        //@ts-ignore
        ref={categoryRef}
      />
      <View style={$buttonsContainer}>
        {isUpdating ? (
          <Button
            textColor="#C62828"
            mode={'text'}
            style={$deleteButton}
            onPress={() =>
              props.action({
                metadata: {
                  type: bottomSheetActions.delete,
                  value: shoppingListItem,
                },
              })
            }>
            {translate('common.delete').toUpperCase()}
          </Button>
        ) : undefined}
        <Button
          style={$createOrUpdateButton}
          mode="contained"
          buttonColor={theme.colors.backdrop}
          labelStyle={$createButtonLabel}
          onPress={() => {
            headerRef.current?.setProduct({id: 'n/a', name: ''});
            quantityUnitRef.current?.setQuantity(0);
            quantityUnitRef.current?.setUnit('');
            categoryRef.current?.setCategory({id: 'n/a', color: ''});
            props.action({
              metadata: {
                type: isUpdating
                  ? bottomSheetActions.update
                  : bottomSheetActions.add,
                value: {
                  id: shoppingListItem?.id ?? '',
                  quantity: quantityUnitRef.current?.getQuantity() ?? 0,
                  unit: quantityUnitRef.current?.getUnit() ?? '',
                  product: headerRef.current?.getProduct(),
                  category: categoryRef.current?.getCategory(),
                } as ShoppingListItem,
              },
            });
          }}>
          {isUpdating
            ? translate('ShoppingListScreen.AddOrUpdateBottomSheet.update')
            : translate('ShoppingListScreen.AddOrUpdateBottomSheet.add')}
        </Button>
      </View>
    </View>
  );
};

const $buttonsContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $createOrUpdateButton: ViewStyle = {
  flex: 1,
  margin: 16,
};

const $deleteButton: ViewStyle = {
  flex: 1,
};

const $createButtonLabel: TextStyle = {
  fontSize: 16,
};

export default AddOrUpdateItem;
