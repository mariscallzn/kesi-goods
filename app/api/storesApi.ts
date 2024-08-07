import {ShoppingListItem, Store} from '@/model/types';

export interface StoreApi {
  backupList(store: Store, items: ShoppingListItem[]): Promise<Store>;
}

export class AWSStoreApi implements StoreApi {
  constructor() {}
  backupList(store: Store, items: ShoppingListItem[]): Promise<Store> {
    throw new Error('Method not implemented.');
  }
}
