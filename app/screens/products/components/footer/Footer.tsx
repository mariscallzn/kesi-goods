import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {FAB} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {goBackSelector} from '../../redux-slice/selectors';
import {FooterProps} from './types';
import {CONTENT_ACTIONS} from '../../types';
import {useAppDispatch} from '../../../../redux/store';
import {addSelection} from '../../redux-slice/productsSlice';

const Footer: React.FC<FooterProps> = props => {
  const goBackSelect = useSelector(goBackSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (goBackSelect) {
      props.action({type: CONTENT_ACTIONS.back, value: undefined});
    }
  }, [goBackSelect, props]);

  return (
    <View>
      <FAB
        style={$fab}
        icon="check"
        onPress={() => {
          dispatch(
            addSelection({
              listId: props.store.id,
              listCloudId: props.store.cloudId,
            }),
          );
        }}
      />
    </View>
  );
};

const $fab: ViewStyle = {
  position: 'absolute',
  end: 0,
  bottom: 0,
  marginBottom: 16,
  marginEnd: 16,
};

export default Footer;
