import React from 'react';
import {View, ViewStyle} from 'react-native';
import {FAB, Snackbar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {translate} from '../../../../i18n/translate';
import {useAppDispatch} from '../../../../redux/store';
import {
  headerInfoSelector,
  snackbarSelector,
} from '../../redux-slice/selectors';
import {
  dismissSnackbar,
  restoreShoppingList,
} from '../../redux-slice/shoppingListSlice';
import {FooterProps} from './types';
import {CONTENT_ACTIONS} from '../../types';

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
            dispatch(
              restoreShoppingList({
                listId: props.storeListId,
                metadata: selectFooter.metadata,
              }),
            );
            dispatch(dismissSnackbar());
          },
        }}>
        {selectFooter.message}
      </Snackbar>
      {!selectHeader.searchEnabled ? (
        <FAB
          style={$fab}
          icon="plus"
          label={translate('common.add')}
          onPress={() =>
            props.action({
              metadata: {
                type: CONTENT_ACTIONS.header.navigateToProducts,
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
