import React from 'react';
import {View} from 'react-native';
import GenericBottomSheetToolBar from '../../../../../components/GenericBottomSheetToolBar';
import GenericRow from '../../../../../components/GenericRow';
import {bottomSheetActions} from '../../../../../components/types';
import {useAppTheme} from '../../../../../theme/theme';
import {CopyListMenuProps} from './types';

const CopyListMenu: React.FC<CopyListMenuProps> = props => {
  const {colors} = useAppTheme();
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
          rippleColor: colors.primaryContainerAlpha,
          action: action => props.action?.(action),
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
          rippleColor: colors.primaryContainerAlpha,
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
          rippleColor: colors.primaryContainerAlpha,
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
