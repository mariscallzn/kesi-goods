import {ActionCallback} from '@/inf/multiViewRenderer';
import {StoreUser} from '@/model/types';

export type ItemMenuProps = {
  storeUser: StoreUser;
  action: ActionCallback;
};
