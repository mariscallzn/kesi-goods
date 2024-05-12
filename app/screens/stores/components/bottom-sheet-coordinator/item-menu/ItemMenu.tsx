import {View} from 'react-native';
import React from 'react';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import {ItemMenuProps} from './types';
import GenericRow from '../../../../../components/GenericRow';

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
          action: action => {
            console.log(JSON.stringify(action));
          },
          rippleColor: '#2ECC7126',
        }}
      />
      <GenericRow
        title={{title: {key: 'StoreScreen.ItemMenuBottomSheet.copy'}}}
        leftIcon={{icon: 'content-copy'}}
        rightIcon={{icon: 'chevron-right'}}
        action={{
          action: action => {
            console.log(JSON.stringify(action));
          },
          rippleColor: '#2ECC7126',
        }}
      />
      <GenericRow
        title={{
          title: {key: 'StoreScreen.ItemMenuBottomSheet.delete'},
          color: '#C62828',
        }}
        leftIcon={{icon: 'trash-can-outline', color: '#C62828'}}
        action={{
          action: action => {
            console.log(JSON.stringify(action));
          },
          rippleColor: '#E0627A26',
        }}
      />
    </View>
  );
};

export default ItemMenu;
