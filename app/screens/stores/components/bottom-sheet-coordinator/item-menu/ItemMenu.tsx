import React from 'react';
import {View} from 'react-native';
import {ItemMenuProps} from './types';
import GenericBottomSheetToolBar from '@/components/GenericBottomSheetToolBar';
import {useAppTheme} from '@/theme/theme';
import {bottomSheetActions} from '@/components/types';
import GenericRow from '@/components/GenericRow';

//TODO: Adjust ripple colors from theme
const ItemMenu: React.FC<ItemMenuProps> = props => {
  const {colors} = useAppTheme();
  const store = props.storeUser;
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
              value: store,
            },
          },
        }}
      />
      {!store.cloudId && (
        <GenericRow
          title={{title: {key: 'StoreScreen.ItemMenuBottomSheet.syncUp'}}}
          leftIcon={{icon: 'cloud-upload-outline'}}
          action={{
            rippleColor: colors.primaryContainerAlpha,
            action: action => props.action?.(action),
            passOnMetadata: {
              metadata: {
                type: store.user
                  ? bottomSheetActions.syncUp
                  : bottomSheetActions.login,
                value: store,
              },
            },
          }}
        />
      )}
      <GenericRow
        title={{title: {key: 'StoreScreen.ItemMenuBottomSheet.share'}}}
        leftIcon={{icon: 'account-plus'}}
        action={{
          rippleColor: colors.primaryContainerAlpha,
          action: action => props.action?.(action),
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.share,
              value: store,
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
              value: store,
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
              value: store,
            },
          },
        }}
      />
    </View>
  );
};

export default ItemMenu;
