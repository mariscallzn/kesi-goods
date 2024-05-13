import React from 'react';
import {View} from 'react-native';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import GenericRow from '../../../../../components/GenericRow';
import {bottomSheetActions} from '../../../../../components/types';
import {ItemMenuProps} from './types';

//TODO: Adjust ripple colors from theme
const ItemMenu: React.FC<ItemMenuProps> = props => {
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
          rippleColor: '#2ECC7126',
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
          rippleColor: '#2ECC7126',
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
          color: '#C62828',
        }}
        leftIcon={{icon: 'trash-can-outline', color: '#C62828'}}
        action={{
          rippleColor: '#E0627A26',
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
