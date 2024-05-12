import React from 'react';
import {useSelector} from 'react-redux';
import BottomSheet from '../../../../components/BottomSheet';
import {useAppDispatch} from '../../../../redux/store';
import {bottomSheetSelector} from '../../redux-slice/selectors';
import {
  createOrUpdateStore,
  hideBottomSheet,
} from '../../redux-slice/storesSlice';
import {BottomSheetCoordinatorProps, bottomSheetTypes} from './types';
import CreateList from './create-list/CreateList';
import {bottomSheetActions} from '../../../../components/types';
import ItemMenu from './item-menu/ItemMenu';
import {Action} from '../../../../inf/multiViewRenderer';

const BottomSheetCoordinator: React.FC<BottomSheetCoordinatorProps> = props => {
  const selectBottomSheet = useSelector(bottomSheetSelector);
  const dispatch = useAppDispatch();

  const bottomSheetActionsHandler = (action: Action) => {
    switch (action.metadata.type) {
      case bottomSheetActions.close:
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.create:
        dispatch(
          createOrUpdateStore({
            name: action.metadata.value as string,
            id: '',
          }),
        );
        break;
      default:
        props.action(action);
        break;
    }
  };

  return (
    <BottomSheet
      maxHeight={props.maxHeight}
      isVisible={selectBottomSheet.isVisible}
      dismissed={() => dispatch(hideBottomSheet())}>
      {selectBottomSheet.metadata?.type === bottomSheetTypes.addOrUpdateList ? (
        <CreateList action={action => bottomSheetActionsHandler(action)} />
      ) : selectBottomSheet.metadata?.type === bottomSheetTypes.openItemMenu ? (
        <ItemMenu action={action => bottomSheetActionsHandler(action)} />
      ) : null}
    </BottomSheet>
  );
};

export default BottomSheetCoordinator;
