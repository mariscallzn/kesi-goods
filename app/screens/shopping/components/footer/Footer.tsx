import React from 'react';
import {Snackbar, FAB} from 'react-native-paper';
import {View, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {translate} from '../../../../i18n/translate';
import {useAppDispatch} from '../../../../redux/store';
import {
  dismissSnackbar,
  openBottomSheet,
} from '../../redux-slice/shoppingListSlice';
import {
  AddOrUpdateBSMetadata,
  bottomSheetTypes,
} from '../bottom-sheet-coordinator/types';
import {FooterProps} from './types';
import {
  headerInfoSelector,
  snackbarSelector,
} from '../../redux-slice/selectors';

const Footer: React.FC<FooterProps> = props => {
  const dispatch = useAppDispatch();
  const selectFooter = useSelector(snackbarSelector);
  const selectHeader = useSelector(headerInfoSelector);

  return (
    <View style={props.style}>
      <Snackbar
        style={$snackbar}
        duration={3000}
        visible={selectFooter.visible}
        onDismiss={() => dispatch(dismissSnackbar())}
        action={{
          label: translate('common.undo'),
          onPress: () => {
            // dispatch(restoreStoreList(selectFooter.metadata.value as Store[]));
            dispatch(dismissSnackbar());
          },
        }}>
        {translate('common.delete')}
      </Snackbar>
      {!selectHeader.searchEnabled ? (
        <FAB
          style={$fab}
          icon="plus"
          label={translate('common.add')}
          onPress={() =>
            dispatch(
              openBottomSheet({
                type: bottomSheetTypes.addOrUpdateItem,
                value: {listId: props.storeListId} as AddOrUpdateBSMetadata,
              }),
            )
          }
        />
      ) : null}
    </View>
  );
};

const $fab: ViewStyle = {
  position: 'absolute',
  end: 0,
  bottom: 0,
};

const $snackbar: ViewStyle = {
  marginBottom: 110,
};

export default Footer;
