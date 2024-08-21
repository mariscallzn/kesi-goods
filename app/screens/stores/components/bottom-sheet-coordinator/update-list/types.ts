import {ActionCallback} from '@/inf/multiViewRenderer';
import {StoreUser} from '@/model/types';

export type UpdateListProps = {
  metadata: StoreUser;
  action: ActionCallback;
};
