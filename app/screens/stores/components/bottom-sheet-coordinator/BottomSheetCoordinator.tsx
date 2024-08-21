import BottomSheet from '@/components/BottomSheet';
import {Action} from '@/inf/multiViewRenderer';
import {Store, StoreUser} from '@/model/types';
import {useAppDispatch} from '@/redux/store';
import React from 'react';
import {useSelector} from 'react-redux';
import {bottomSheetSelector} from '../../redux-slice/selectors';
import {
  copyList,
  createOrUpdateStore,
  createSharedLink,
  hideBottomSheet,
  markStoreListAsDelete,
  openBottomSheet,
} from '../../redux-slice/storesSlice';
import CopyListMenu from './copy-list-menu/CopyListMenu';
import ItemMenu from './item-menu/ItemMenu';
import ShareLink from './share-link/ShareLink';
import {ShareLinkMetadata} from './share-link/types';
import {BottomSheetCoordinatorProps, bottomSheetTypes} from './types';
import UpdateList from './update-list/UpdateList';
import {bottomSheetActions} from '@/components/types';

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
      case bottomSheetActions.delete:
        dispatch(markStoreListAsDelete([action.metadata.value as Store]));
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.copy:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.copyListOptions,
            value: action.metadata.value as Store,
          }),
        );
        break;
      case bottomSheetActions.wholeList:
        dispatch(
          copyList({
            stores: [action.metadata.value as Store],
            copyOption: 'whole-list',
          }),
        );
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.checkedItems:
        dispatch(
          copyList({
            stores: [action.metadata.value as Store],
            copyOption: 'checked-items',
          }),
        );
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.uncheckedItems:
        dispatch(
          copyList({
            stores: [action.metadata.value as Store],
            copyOption: 'unchecked-items',
          }),
        );
        dispatch(hideBottomSheet());
        break;
      case bottomSheetActions.update:
      case bottomSheetActions.create:
        dispatch(createOrUpdateStore(action.metadata.value as Store));
        break;
      case bottomSheetActions.share:
        dispatch(
          openBottomSheet({
            type: bottomSheetTypes.shareList,
            value: {store: action.metadata.value, button: ''},
          }),
        );
        break;
      case bottomSheetActions.createLink:
        const metadata = action.metadata.value as ShareLinkMetadata;
        dispatch(
          createSharedLink({store: metadata.store, button: metadata.button}),
        );
        break;

      default:
        dispatch(hideBottomSheet());
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
        <UpdateList
          action={action => bottomSheetActionsHandler(action)}
          metadata={selectBottomSheet.metadata.value as StoreUser}
        />
      ) : selectBottomSheet.metadata?.type === bottomSheetTypes.openItemMenu ? (
        <ItemMenu
          storeUser={selectBottomSheet.metadata.value as StoreUser}
          action={action => bottomSheetActionsHandler(action)}
        />
      ) : selectBottomSheet.metadata?.type ===
        bottomSheetTypes.copyListOptions ? (
        <CopyListMenu
          storeUser={selectBottomSheet.metadata.value as StoreUser}
          action={action => bottomSheetActionsHandler(action)}
        />
      ) : selectBottomSheet.metadata?.type === bottomSheetTypes.shareList ? (
        <ShareLink
          action={action => bottomSheetActionsHandler(action)}
          metadata={selectBottomSheet.metadata.value as ShareLinkMetadata}
        />
      ) : null}
    </BottomSheet>
  );
};

export default BottomSheetCoordinator;
