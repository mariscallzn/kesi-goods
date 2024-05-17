import React from 'react';
import {View, ViewStyle} from 'react-native';
import {FAB, Snackbar} from 'react-native-paper';
import {translate} from '../../../../i18n/translate';
import {useAppDispatch} from '../../../../redux/store';
import {
  openBottomSheet,
  dismissSnackbar,
  restoreStoreList,
} from '../../redux-slice/storesSlice';
import {bottomSheetTypes} from '../bottom-sheet-coordinator/types';
import {FooterProps} from './types';
import {
  multiSelectionSelector,
  snackbarSelector,
} from '../../redux-slice/selectors';
import {useSelector} from 'react-redux';
import {Store} from '../../../../model/types';

const Footer: React.FC<FooterProps> = props => {
  const dispatch = useAppDispatch();
  const selectFooter = useSelector(snackbarSelector);
  const selectMultiSelection = useSelector(multiSelectionSelector);

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
            dispatch(restoreStoreList(selectFooter.metadata.value as Store[]));
            dispatch(dismissSnackbar());
          },
        }}>
        {translate('StoreScreen.storeDeleted')}
      </Snackbar>
      {!selectMultiSelection.isEnabled ? (
        <FAB
          style={$fab}
          icon="plus"
          label={translate('StoreScreen.addList')}
          onPress={() =>
            dispatch(
              openBottomSheet({
                type: bottomSheetTypes.addOrUpdateList,
                value: undefined,
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
