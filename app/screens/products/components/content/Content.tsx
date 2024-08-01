import React from 'react';
import {ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {getComponent} from '../../../../inf/dynamic-render';
import {useAppDispatch} from '../../../../redux/store';
import {draftChange} from '../../redux-slice/productsSlice';
import {productsSelector} from '../../redux-slice/selectors';
import {PRODUCT_ITEM_ACTION} from '../../types';
import {ContentProps, IView, componentMap} from './types';
import {Action} from '../../../../inf/types';

const Content: React.FC<ContentProps> = props => {
  const dispatch = useAppDispatch();
  const selectProducts = useSelector(productsSelector);

  const actions = (action: Action) => {
    switch (action.type) {
      case PRODUCT_ITEM_ACTION.update:
        dispatch(draftChange({action: action, listId: props.listId}));
        break;

      default:
        props.action(action);
        break;
    }
  };

  const renderView = (view: IView): React.JSX.Element =>
    getComponent(view, componentMap);

  return (
    <FlatList
      contentContainerStyle={$flatList}
      data={selectProducts}
      keyExtractor={item => item.id}
      keyboardShouldPersistTaps={'always'}
      renderItem={({item}) => renderView({...item, action: actions})}
    />
  );
};

const $flatList: ViewStyle = {
  paddingBottom: 150,
};

export default Content;
