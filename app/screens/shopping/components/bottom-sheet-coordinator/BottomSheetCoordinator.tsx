import React from 'react';
import {useSelector} from 'react-redux';
import BottomSheet from '../../../../components/BottomSheet';
import {bottomSheetActions} from '../../../../components/types';
import {Action} from '../../../../inf/multiViewRenderer';
import {ShoppingListItem} from '../../../../model/types';
import {useAppDispatch} from '../../../../redux/store';
import {bottomSheetSelector} from '../../redux-slice/selectors';
import {
  createOrUpdateItem,
  hideBottomSheet,
  toggleSearch,
  uncheckAllListItems,
} from '../../redux-slice/shoppingListSlice';
import AddOrUpdateItem from './add-or-update-item/AddOrUpdateItem';
import ListMenu from './list-menu/ListMenu';
import {
  AddOrUpdateBSMetadata,
  BottomSheetCoordinatorProps,
  bottomSheetTypes,
} from './types';

const BottomSheetCoordinator: React.FC<BottomSheetCoordinatorProps> = props => {
  const selectBottomSheet = useSelector(bottomSheetSelector);
  const dispatch = useAppDispatch();

  const handleAddOrUpdateActions = (action: Action) => {
    switch (action.metadata.type) {
      case bottomSheetActions.update:
      case bottomSheetActions.add:
        dispatch(
          createOrUpdateItem({
            listId: (selectBottomSheet.metadata?.value as AddOrUpdateBSMetadata)
              .listId,
            shoppingListItem: action.metadata.value as ShoppingListItem,
          }),
        );
        dispatch(hideBottomSheet());
        break;

      case bottomSheetActions.back:
        dispatch(hideBottomSheet());
        break;

      default:
        props.action(action);
        break;
    }
  };

  const handleListMenuActions = (action: Action) => {
    switch (action.metadata.type) {
      case bottomSheetActions.search:
        dispatch(hideBottomSheet());
        dispatch(toggleSearch(true));
        break;

      case bottomSheetActions.close:
        dispatch(hideBottomSheet());
        break;

      case bottomSheetActions.uncheckAll:
        dispatch(uncheckAllListItems(props.storeId));
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.deleteChecked:
        break;

      default:
        break;
    }
  };

  return (
    <BottomSheet
      maxHeight={props.maxHeight}
      isVisible={selectBottomSheet.isVisible}
      dismissed={() => dispatch(hideBottomSheet())}>
      {selectBottomSheet.metadata?.type === bottomSheetTypes.addOrUpdateItem ? (
        <AddOrUpdateItem
          action={handleAddOrUpdateActions}
          metadata={selectBottomSheet.metadata.value as AddOrUpdateBSMetadata}
        />
      ) : selectBottomSheet.metadata?.type === bottomSheetTypes.listMenu ? (
        <ListMenu action={handleListMenuActions} />
      ) : null}
    </BottomSheet>
  );
};

export default BottomSheetCoordinator;
