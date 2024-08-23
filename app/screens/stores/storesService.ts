import {KUser, ShoppingListItem, Store} from '@/model/types';
import {VIEW_ID} from './components/content/types';
import {CopyListOption, UIStore} from './types';
import {StoresRepository} from '@/model/storesRepository';
import {ShoppingListRepository} from '@/model/shoppingListRepository';
import {getUUID} from '@/utils/misc';
import {AuthRepository} from '@/model/authRepository';
import {StoreApi} from '@/api/storesApi';
import {ProductRepository} from '@/model/productRepository';
import {CategoryRepository} from '@/model/categoryRepository';

export interface StoresService {
  fetchStores(): Promise<UIStore[]>;
  getUser(): Promise<KUser | undefined>;
  syncUp(): Promise<UIStore[]>;
  backupList(store: Store): Promise<UIStore>;
  createOrUpdate(store: Store): Promise<UIStore>;
  copyStoreList(stores: Store[], copyOption: CopyListOption): Promise<void>;
  markStoreListAsDelete(stores: Store[]): Promise<Store[]>;
  destroyDeletedStores(): Promise<void>;
  restoreStoreList(stores: Store[]): Promise<Store[]>;
}

export class StoresServiceImpl implements StoresService {
  private readonly storesRepository: StoresRepository;
  private readonly shoppingListRepository: ShoppingListRepository;
  private readonly authRepo: AuthRepository;
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly storeApi: StoreApi;

  constructor(
    storesRepository: StoresRepository,
    shoppingListRepository: ShoppingListRepository,
    authRepo: AuthRepository,
    productRepository: ProductRepository,
    categoryRepository: CategoryRepository,
    storeApi: StoreApi,
  ) {
    this.storesRepository = storesRepository;
    this.shoppingListRepository = shoppingListRepository;
    this.authRepo = authRepo;
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.storeApi = storeApi;
  }

  async getUser(): Promise<KUser | undefined> {
    return await this.authRepo.getUser();
  }

  async backupList(store: Store): Promise<UIStore> {
    try {
      const user = await this.authRepo.getUser();
      if (user) {
        const shoppingList = await this.shoppingListRepository.getByStoreId(
          store.id,
          ['active', 'pinned'],
        );

        const backedUpStore = await this.storeApi.backupList(
          store,
          shoppingList,
          user,
        );

        await this.storesRepository.addOrUpdate(backedUpStore);

        return {
          id: getUUID(),
          multiSelectionEnabled: false,
          store: {
            ...backedUpStore,
            totalItems: shoppingList.length,
            checkedItems: shoppingList.filter(e => e.checked).length,
          },
          type: VIEW_ID.store,
        };
      } else {
        throw new Error('User must be logged in to backup lists');
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchStores(): Promise<UIStore[]> {
    try {
      const result: UIStore[] = [];
      const stores = await this.storesRepository.fetch();
      for (const store of stores) {
        const totalItems = await this.shoppingListRepository.getByStoreId(
          store.id,
          ['active', 'pinned'],
        );
        result.push({
          id: getUUID(),
          store: {
            ...store,
            totalItems: totalItems.length,
            checkedItems: totalItems.filter(e => e.checked).length,
          },
          type: VIEW_ID.store,
          multiSelectionEnabled: false,
        });
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async syncUp(): Promise<UIStore[]> {
    try {
      const user = await this.authRepo.getUser();
      if (user) {
        const lists = await this.storeApi.fetchListByUser(user);

        for (const list of lists) {
          const newOrUpdatedStore = await this.storesRepository.addOrUpdate({
            id: 'n/a',
            name: list.name ?? '',
            cloudId: list.id,
          });

          for (const item of list.items) {
            await this.shoppingListRepository.addOrUpdate(
              newOrUpdatedStore.id,
              {
                id: 'n/a',
                cloudId: item.id,
                checked: item.checked,
                product: await this.productRepository.findOrCreateByName({
                  id: 'n/a',
                  name: item.name,
                }),
                category: await this.categoryRepository.findOrCreateByName({
                  id: 'n/a',
                  color: item.category ?? '',
                }),
                quantity: item.quantity ?? 0,
                unit: item.unit ?? '',
                status: 'active',
              },
            );
          }
        }
      }

      return await this.fetchStores();
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

  async destroyDeletedStores(): Promise<void> {
    try {
      const user = await this.authRepo.getUser();
      if (user) {
        const deletedStores = await this.storesRepository.fetch(['deleted']);
        await this.storeApi.deleteLists(deletedStores);
      }
      return await this.storesRepository.destroyRecords(['deleted']);
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
