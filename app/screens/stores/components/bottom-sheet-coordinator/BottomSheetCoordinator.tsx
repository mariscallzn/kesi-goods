import React from 'react';
import {useSelector} from 'react-redux';
import BottomSheet from '../../../../components/BottomSheet';
import {useAppDispatch} from '../../../../redux/store';
import {bottomSheetSelector} from '../../redux-slice/selectors';
import {
  createOrUpdateStore,
  hideBottomSheet,
  openBottomSheet,
} from '../../redux-slice/storesSlice';
import {BottomSheetCoordinatorProps, bottomSheetTypes} from './types';
import AddOrUpdateList from './add-or-update-list/AddOrUpdateList';
import {bottomSheetActions} from '../../../../components/types';
import ItemMenu from './item-menu/ItemMenu';
import {Action} from '../../../../inf/multiViewRenderer';
import {Store} from '../../../../model/types';

const BottomSheetCoordinator: React.FC<BottomSheetCoordinatorProps> = props => {
  const selectBottomSheet = useSelector(bottomSheetSelector);
  const dispatch = useAppDispatch();

  const bottomSheetActionsHandler = (action: Action) => {
    switch (action.metadata.type) {
      case bottomSheetActions.close:
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.rename:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.addOrUpdateList,
            value: action.metadata.value as Store,
          }),
        );
        break;
      case bottomSheetActions.update:
      case bottomSheetActions.create:
        dispatch(createOrUpdateStore(action.metadata.value as Store));
        break;
      case bottomSheetActions.delete:
        //TODO:
        break;
      case bottomSheetActions.copy:
        //TODO:
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
        <AddOrUpdateList
          action={action => bottomSheetActionsHandler(action)}
          metadata={{store: selectBottomSheet.metadata.value as Store}}
        />
      ) : selectBottomSheet.metadata?.type === bottomSheetTypes.openItemMenu ? (
        <ItemMenu
          store={selectBottomSheet.metadata.value as Store}
          action={action => bottomSheetActionsHandler(action)}
        />
      ) : null}
    </BottomSheet>
  );
};

export default BottomSheetCoordinator;
