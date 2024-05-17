import React from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import GenericRow from '../../../../../components/GenericRow';
import {bottomSheetActions} from '../../../../../components/types';
import {ListMenuProps} from './types';
import {translate} from '../../../../../i18n/translate';

const ListMenu: React.FC<ListMenuProps> = props => {
  const {colors} = useTheme();
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
        title={{
          title: {key: 'ShoppingListScreen.ListMenuBottomSheet.uncheckAll'},
        }}
        leftIcon={{icon: 'checkbox-multiple-blank-circle-outline'}}
        action={{
          rippleColor: '#2ECC7126',
          action: action => props.action?.(action),
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.uncheckAll,
              value: undefined,
            },
          },
        }}
      />
      <GenericRow
        title={{
          title: {
            key: 'ShoppingListScreen.ListMenuBottomSheet.deleteCheckedItems',
          },
          color: '#C62828',
        }}
        leftIcon={{icon: 'trash-can-outline', color: '#C62828'}}
        action={{
          rippleColor: '#E0627A26',
          action: action => props.action?.(action),
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
