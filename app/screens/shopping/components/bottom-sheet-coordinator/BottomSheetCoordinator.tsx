import React from 'react';
import {useSelector} from 'react-redux';
import BottomSheet from '../../../../components/BottomSheet';
import {ShoppingListItem} from '../../../../model/types';
import {useAppDispatch} from '../../../../redux/store';
import {bottomSheetSelector} from '../../redux-slice/selectors';
import {
  createOrUpdateItem,
  hideBottomSheet,
} from '../../redux-slice/shoppingListSlice';
import AddOrUpdateItem from './add-or-update-item/AddOrUpdateItem';
import {
  AddOrUpdateBSMetadata,
  BottomSheetCoordinatorProps,
  bottomSheetActions,
  bottomSheetTypes,
} from './types';

const BottomSheetCoordinator: React.FC<BottomSheetCoordinatorProps> = props => {
  const selectBottomSheet = useSelector(bottomSheetSelector);
  const dispatch = useAppDispatch();

  return (
    <BottomSheet
      maxHeight={props.maxHeight}
      isVisible={selectBottomSheet.isVisible}
      dismissed={() => dispatch(hideBottomSheet())}>
      {selectBottomSheet.metadata?.type === bottomSheetTypes.addOrUpdateItem ? (
        <AddOrUpdateItem
          action={action => {
            switch (action.metadata.type) {
              case bottomSheetActions.add:
                dispatch(
                  createOrUpdateItem({
                    listId: (
                      selectBottomSheet.metadata?.value as AddOrUpdateBSMetadata
                    ).listId,
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
          }}
          metadata={selectBottomSheet.metadata.value as AddOrUpdateBSMetadata}
        />
      ) : null}
    </BottomSheet>
  );
};

export default BottomSheetCoordinator;
