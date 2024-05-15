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
import {footerSelector} from '../../redux-slice/selectors';
import {useSelector} from 'react-redux';
import {Store} from '../../../../model/types';

const Footer: React.FC<FooterProps> = props => {
  const dispatch = useAppDispatch();
  const selectFooter = useSelector(footerSelector);

  return (
    <View style={props.style}>
      <Snackbar
        style={$snackbar}
        duration={3000}
        visible={selectFooter.snackbar.visible}
        onDismiss={() => dispatch(dismissSnackbar())}
        action={{
          label: translate('common.undo'),
          onPress: () => {
            dispatch(
              restoreStoreList(selectFooter.snackbar.metadata.value as Store),
            );
            dispatch(dismissSnackbar());
          },
        }}>
        {translate('StoreScreen.storeDeleted')}
      </Snackbar>
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
