import {KUser, ShoppingListItem, Store} from '@/model/types';
import {VIEW_ID} from './components/content/types';
import {CopyListOption, UIStore} from './types';
import {StoresRepository} from '@/model/storesRepository';
import {ShoppingListRepository} from '@/model/shoppingListRepository';
import {getUUID} from '@/utils/misc';
import {AuthRepository} from '@/model/authRepository';

export interface StoresService {
  getUser(): Promise<KUser | undefined>;
  getStores(): Promise<UIStore[]>;
  createOrUpdate(store: Store): Promise<UIStore>;
  copyStoreList(stores: Store[], copyOption: CopyListOption): Promise<void>;
  markStoreListAsDelete(stores: Store[]): Promise<Store[]>;
  restoreStoreList(stores: Store[]): Promise<Store[]>;
}

export class StoresServiceImpl implements StoresService {
  private readonly storesRepository: StoresRepository;
  private readonly shoppingListRepository: ShoppingListRepository;
  private readonly authRepo: AuthRepository;

  constructor(
    storesRepository: StoresRepository,
    shoppingListRepository: ShoppingListRepository,
    authRepo: AuthRepository,
  ) {
    this.storesRepository = storesRepository;
    this.shoppingListRepository = shoppingListRepository;
    this.authRepo = authRepo;
  }

  async getUser(): Promise<KUser | undefined> {
    return await this.authRepo.getUser();
  }

  async getStores(): Promise<UIStore[]> {
    try {
      return (await this.storesRepository.fetch()).map(store => ({
        id: getUUID(),
        store: store,
        type: VIEW_ID.store,
        multiSelectionEnabled: false,
      }));
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdate(store: Store): Promise<UIStore> {
    try {
      //TODO: Add validations

      return {
        id: getUUID(),
        store: await this.storesRepository.addOrUpdate(store),
        type: VIEW_ID.store,
        multiSelectionEnabled: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async copyStoreList(
    stores: Store[],
    copyOption: CopyListOption,
  ): Promise<void> {
    try {
      for (const store of stores) {
        let items: ShoppingListItem[] = [];
        switch (copyOption) {
          case 'whole-list':
            items = await this.shoppingListRepository.getByStoreId(store.id, [
              'active',
            ]);
            break;
          case 'checked-items':
            items = await this.shoppingListRepository.getCheckedByStoreId(
              store.id,
            );
            break;
          case 'unchecked-items':
            items =
              await this.shoppingListRepository.getUncheckedItemsByStoreId(
                store.id,
              );
            break;
        }

        const copyStore = await this.storesRepository.addOrUpdate({
          id: '',
          name: `${store.name} - Copy`,
        });

        for (const item of items) {
          await this.shoppingListRepository.addOrUpdate(copyStore.id, {
            ...item,
            checked: false,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async markStoreListAsDelete(stores: Store[]): Promise<Store[]> {
    try {
      const updatedList: Store[] = [];
      for (const store of stores) {
        updatedList.push(await this.storesRepository.markAsDelete(store));
      }
      return updatedList;
    } catch (error) {
      throw error;
    }
  }

  async restoreStoreList(stores: Store[]): Promise<Store[]> {
    try {
      const updatedList: Store[] = [];
      for (const store of stores) {
        updatedList.push(await this.storesRepository.restore(store));
      }
      return updatedList;
    } catch (error) {
      throw error;
    }
  }
}
