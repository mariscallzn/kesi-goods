import React from 'react';
import {View} from 'react-native';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import {CopyListMenuProps} from './types';
import GenericRow from '../../../../../components/GenericRow';
import {bottomSheetActions} from '../../../../../components/types';

const CopyListMenu: React.FC<CopyListMenuProps> = props => {
  return (
    <View>
      <GenericBottomSheetToolBar
        action={props.action}
        title={{key: 'StoreScreen.CopyListMenuBottomSheet.copy'}}
      />
      <GenericRow
        title={{title: {key: 'StoreScreen.CopyListMenuBottomSheet.wholeList'}}}
        leftIcon={{icon: 'format-list-checkbox'}}
        action={{
          rippleColor: '#2ECC7126',
          action: action => props.action?.(action),
          // TODO: Value must send the store an the action that must be taken: whole list
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.wholeList,
              value: props.store,
            },
          },
        }}
      />
      <GenericRow
        title={{title: {key: 'StoreScreen.CopyListMenuBottomSheet.checkItems'}}}
        leftIcon={{icon: 'checkbox-multiple-marked-circle-outline'}}
        action={{
          rippleColor: '#2ECC7126',
          action: action => props.action?.(action),
          // TODO: Value must send the store an the action that must be taken: checked items
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.checkedItems,
              value: props.store,
            },
          },
        }}
      />
      <GenericRow
        title={{
          title: {key: 'StoreScreen.CopyListMenuBottomSheet.uncheckedItems'},
        }}
        leftIcon={{icon: 'checkbox-multiple-blank-circle-outline'}}
        action={{
          rippleColor: '#2ECC7126',
          action: action => props.action?.(action),
          // TODO: Value must send the store an the action that must be taken: unchecked items
          passOnMetadata: {
            metadata: {
              type: bottomSheetActions.uncheckedItems,
              value: props.store,
            },
          },
        }}
      />
    </View>
  );
};

export default CopyListMenu;
