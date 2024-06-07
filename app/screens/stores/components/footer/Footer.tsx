import React from 'react';
import {View, ViewStyle} from 'react-native';
import {FAB, Snackbar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {translate} from '../../../../i18n/translate';
import {Store} from '../../../../model/types';
import {useAppDispatch} from '../../../../redux/store';
import {
  multiSelectionSelector,
  snackbarSelector,
} from '../../redux-slice/selectors';
import {dismissSnackbar, restoreStoreList} from '../../redux-slice/storesSlice';
import {CONTENT_ACTIONS} from '../../types';
import {FooterProps} from './types';

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
            props.action({
              metadata: {
                type: CONTENT_ACTIONS.addStoreScreen,
                value: undefined,
              },
            })
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
