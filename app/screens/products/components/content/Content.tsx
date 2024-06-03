import React from 'react';
import {ViewStyle} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {Action, multiViewRenderer} from '../../../../inf/multiViewRenderer';
import {useAppDispatch} from '../../../../redux/store';
import {draftChange} from '../../redux-slice/productsSlice';
import {productsSelector} from '../../redux-slice/selectors';
import {PRODUCT_ITEM_ACTION} from '../../types';
import {CUSTOM_VIEWS, ContentProps} from './types';

const Content: React.FC<ContentProps> = props => {
  const dispatch = useAppDispatch();
  const selectProducts = useSelector(productsSelector);

  const actions = (action: Action) => {
    switch (action.metadata.type) {
      case PRODUCT_ITEM_ACTION.update:
        dispatch(draftChange({action: action, listId: props.listId}));
        break;

      default:
        props.action(action);
        break;
    }
  };

  return (
    <FlatList
      contentContainerStyle={$flatList}
      data={selectProducts}
      keyExtractor={item => item.id}
      keyboardShouldPersistTaps={'always'}
      renderItem={({item}) =>
        multiViewRenderer(
          CUSTOM_VIEWS,
          //@ts-ignore
          {...item, action: actions},
        )
      }
    />
  );
};

const $flatList: ViewStyle = {
  paddingBottom: 150,
};

export default Content;
