import React from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import GenericRow from '../../../../../components/GenericRow';
import {bottomSheetActions} from '../../../../../components/types';
import {translate} from '../../../../../i18n/translate';
import {ShoppingListItem} from '../../../../../model/types';
import {useAppTheme} from '../../../../../theme/theme';
import {itemsSelector} from '../../../redux-slice/selectors';
import {ListMenuProps} from './types';

const ListMenu: React.FC<ListMenuProps> = props => {
  const itemSelect = useSelector(itemsSelector);
  const {colors} = useAppTheme();

  const areMenuItemsEnabled = itemSelect.some(item => {
    if ('shoppingListItem' in item) {
      return (item.shoppingListItem as ShoppingListItem).checked;
    } else {
      return false;
    }
  });

  return (
    <View>
      <GenericBottomSheetToolBar
        action={props.action}
        title={{key: 'ShoppingListScreen.ListMenuBottomSheet.manageList'}}
      />
      <Pressable
        onPress={() =>
          props.action({
            metadata: {type: bottomSheetActions.search, value: undefined},
          })
        }>
        <View style={[$searchBar, {backgroundColor: colors.surfaceDisabled}]}>
          <IconButton
            icon={'magnify'}
            size={24}
            iconColor={colors.onSurfaceDisabled}
            style={$magnify}
          />
          <Text variant="labelLarge" style={{color: colors.onSurfaceDisabled}}>
            {translate('ShoppingListScreen.ListMenuBottomSheet.searchList')}
          </Text>
        </View>
      </Pressable>
      <GenericRow
        disabled={!areMenuItemsEnabled}
        title={{
          title: {key: 'ShoppingListScreen.ListMenuBottomSheet.uncheckAll'},
        }}
        leftIcon={{icon: 'checkbox-multiple-blank-circle-outline'}}
        action={{
          rippleColor: colors.primaryContainerAlpha,
          action: action =>
            areMenuItemsEnabled ? props.action?.(action) : undefined,
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.uncheckAll,
              value: undefined,
            },
          },
        }}
      />
      <GenericRow
        disabled={!areMenuItemsEnabled}
        title={{
          title: {
            key: 'ShoppingListScreen.ListMenuBottomSheet.deleteCheckedItems',
          },
          color: colors.error,
        }}
        leftIcon={{icon: 'trash-can-outline', color: colors.error}}
        action={{
          rippleColor: colors.errorContainer,
          action: action =>
            areMenuItemsEnabled ? props.action?.(action) : undefined,
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.deleteChecked,
              value: undefined,
            },
          },
        }}
      />
    </View>
  );
};

const $searchBar: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 16,
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 56,
};

const $magnify: ViewStyle = {
  margin: 0,
};

export default ListMenu;
