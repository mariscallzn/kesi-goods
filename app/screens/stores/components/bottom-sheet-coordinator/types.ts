import {MaxHeight} from '../../../../components/BottomSheet';
import {Action} from '../../../../inf/multiViewRenderer';

export type BottomSheetCoordinatorProps = {
  action: (action: Action) => void;
  maxHeight: MaxHeight;
};

/**
 * Type to ensure all needed types are listed and defined on {@link bottomSheetTypes}
 */
type BottomSheetTypes = {
  create: string;
};

export const bottomSheetTypes: BottomSheetTypes = {
  create: 'create',
};
