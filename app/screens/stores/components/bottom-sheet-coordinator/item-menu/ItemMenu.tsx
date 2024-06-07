import React from 'react';
import {View} from 'react-native';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import GenericRow from '../../../../../components/GenericRow';
import {bottomSheetActions} from '../../../../../components/types';
import {ItemMenuProps} from './types';
import {useAppTheme} from '../../../../../theme/theme';

//TODO: Adjust ripple colors from theme
const ItemMenu: React.FC<ItemMenuProps> = props => {
  const {colors} = useAppTheme();
  return (
    <View>
      <GenericBottomSheetToolBar
        action={props.action}
        title={{key: 'StoreScreen.ItemMenuBottomSheet.manageList'}}
      />
      <GenericRow
        title={{title: {key: 'StoreScreen.ItemMenuBottomSheet.rename'}}}
        leftIcon={{icon: 'pencil'}}
        action={{
          rippleColor: colors.primaryContainerAlpha,
          action: action => props.action?.(action),
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.rename,
              value: props.store,
            },
          },
        }}
      />
      <GenericRow
        title={{title: {key: 'StoreScreen.ItemMenuBottomSheet.copy'}}}
        leftIcon={{icon: 'content-copy'}}
        rightIcon={{icon: 'chevron-right'}}
        action={{
          rippleColor: colors.primaryContainerAlpha,
          action: action => props.action?.(action),
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.copy,
              value: props.store,
            },
          },
        }}
      />
      <GenericRow
        title={{
          title: {key: 'StoreScreen.ItemMenuBottomSheet.delete'},
          color: colors.error,
        }}
        leftIcon={{icon: 'trash-can-outline', color: colors.error}}
        action={{
          rippleColor: colors.errorContainer,
          action: action => props.action?.(action),
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.delete,
              value: props.store,
            },
          },
        }}
      />
    </View>
  );
};

export default ItemMenu;
