import React, {useEffect} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {UpdateListProps} from './types';
import ControlledTextInput, {
  ControlledTextInputRef,
} from '@/components/ControlledTextInput';
import GenericBottomSheetToolBar from '@/components/GenericBottomSheetToolBar';
import {bottomSheetActions} from '@/components/types';
import {translate} from '@/i18n/translate';
import {Store} from '@/model/types';

const UpdateList: React.FC<UpdateListProps> = props => {
  const {roundness} = useTheme();
  const store = props.metadata;
  const listNameRef = React.useRef<ControlledTextInputRef>(null);

  useEffect(() => {
    listNameRef.current?.setText(store.name);
  }, [store]);

  return (
    <View>
      <GenericBottomSheetToolBar
        action={props.action}
        title={{
          key: 'StoreScreen.UpdateBottomSheet.renameList',
        }}
      />
      <ControlledTextInput
        //@ts-ignore
        ref={listNameRef}
        style={[$textInput, {borderRadius: roundness}]}
        placeholder={translate('StoreScreen.UpdateBottomSheet.renameList')}
        autoFocus={true}
        underlineStyle={$textInputUnderLine}
      />
      <Button
        style={$createButton}
        mode="contained"
        labelStyle={$createButtonLabel}
        onPress={() => {
          props.action({
            metadata: {
              type: bottomSheetActions.update,
              value: {
                ...store,
                id: store.id,
                name: listNameRef.current?.getText(),
              } as Store,
            },
          });
        }}>
        {translate('StoreScreen.UpdateBottomSheet.update')}
      </Button>
    </View>
  );
};

const $textInput: ViewStyle = {
  marginHorizontal: 16,
};

const $textInputUnderLine: ViewStyle = {
  backgroundColor: 'transparent',
};

const $createButton: ViewStyle = {
  margin: 16,
};

const $createButtonLabel: TextStyle = {
  fontSize: 16,
};

export default UpdateList;
