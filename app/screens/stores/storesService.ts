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
  getUser(): Promise<KUser | undefined>;
  syncUp(): Promise<{user: KUser | undefined; stores: UIStore[]}>;
  createOrUpdate(store: Store): Promise<UIStore>;
  copyStoreList(stores: Store[], copyOption: CopyListOption): Promise<void>;
  markStoreListAsDelete(stores: Store[]): Promise<Store[]>;
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

  async syncUp(): Promise<{user: KUser | undefined; stores: UIStore[]}> {
    try {
      const user = await this.authRepo.getUser();
      const localStores = await this.storesRepository.fetch();
      console.log('Here 1');

      //backup in the cloud all local lists if the user is authenticated
      if (user) {
        console.log('Here 2');
        for (const store of localStores) {
          console.log('Loop 2.1 ' + JSON.stringify(store, null, 2));
          if (store.cloudId === undefined || store.cloudId.length === 0) {
            const shoppingListItems =
              await this.shoppingListRepository.getByStoreId(store.id, [
                'active',
                'pinned',
              ]);

            const newStore = await this.storeApi.backupList(
              store,
              shoppingListItems,
              user,
            );
            console.log('Loop 2.2 ' + JSON.stringify(newStore));

            await this.storesRepository.addOrUpdate(newStore);
          }
        }
        console.log('Here 3');

        //Exclude the already updated stores
        const updatedLocalStores = await this.storesRepository.fetch();
        const lists = (await this.storeApi.fetchListByUser(user)).filter(
          i => !updatedLocalStores.map(e => e.cloudId ?? '').includes(i.id),
        );

        console.log('Here 4');
        for (const list of lists) {
          const newStore = await this.storesRepository.addOrUpdate({
            id: 'n/a',
            name: list.name ?? '',
            cloudId: list.id,
          });

          for (const item of list.items) {
            await this.shoppingListRepository.addOrUpdate(newStore.id, {
              id: 'n/a',
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
            });
          }
        }
        console.log('Here 5');
      }

      const result = {
        user: user,
        //Fetch updated stores again
        stores: (await this.storesRepository.fetch()).map(store => ({
          id: getUUID(),
          store: store,
          type: VIEW_ID.store,
          multiSelectionEnabled: false,
        })),
      };
      return result;
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
