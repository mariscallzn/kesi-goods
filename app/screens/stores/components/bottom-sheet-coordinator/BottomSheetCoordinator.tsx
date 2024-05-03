import React from 'react';
import {useSelector} from 'react-redux';
import BottomSheet from '../../../../components/BottomSheet';
import {useAppDispatch} from '../../../../redux/store';
import {createOrUpdateStore} from '../../redux-slice/asyncThunks';
import {bottomSheetSelector} from '../../redux-slice/selectors';
import {hideBottomSheet} from '../../redux-slice/storesSlice';
import {BottomSheetCoordinatorProps, bottomSheetTypes} from './types';
import CreateList from './create-list/CreateList';

const BottomSheetCoordinator: React.FC<BottomSheetCoordinatorProps> = props => {
  const selectBottomSheet = useSelector(bottomSheetSelector);
  const dispatch = useAppDispatch();
  return (
    <BottomSheet
      maxHeight={props.maxHeight}
      isVisible={selectBottomSheet.isVisible}
      dismissed={() => dispatch(hideBottomSheet())}>
      {selectBottomSheet.metadata?.type === bottomSheetTypes.create ? (
        <CreateList
          action={action => {
            dispatch(
              createOrUpdateStore({
                name: action.metadata.value as string,
                id: '',
              }),
            );
          }}
        />
      ) : null}
    </BottomSheet>
  );
};

export default BottomSheetCoordinator;
