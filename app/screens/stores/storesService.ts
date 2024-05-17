import {ShoppingListRepository} from '../../model/shoppingListRepository';
import {StoresRepository} from '../../model/storesRepository';
import {ShoppingListItem, Store} from '../../model/types';
import {getUUID} from '../../utils/misc';
import {VIEW_ID} from './components/content/types';
import {CopyListOption, ListSuggestions, UIStore} from './types';

export interface StoresService {
  getStores(): Promise<UIStore[]>;
  createOrUpdate(store: Store): Promise<UIStore>;
  fetchListSuggestions(): Promise<ListSuggestions>;
  copyStoreList(stores: Store[], copyOption: CopyListOption): Promise<void>;
  markStoreListAsDelete(stores: Store[]): Promise<Store[]>;
  restoreStoreList(stores: Store[]): Promise<Store[]>;
}

export class StoresServiceImpl implements StoresService {
  private readonly storesRepository: StoresRepository;
  private readonly shoppingListRepository: ShoppingListRepository;

  constructor(
    storesRepository: StoresRepository,
    shoppingListRepository: ShoppingListRepository,
  ) {
    this.storesRepository = storesRepository;
    this.shoppingListRepository = shoppingListRepository;
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

  async fetchListSuggestions(): Promise<ListSuggestions> {
    //TODO: fetch and build suggestions
    // try {
    await new Promise(resolve => {
      setTimeout(resolve, 1);
    });

    return {
      stores: ['Walmart', 'DollarTree', 'Home Depot', 'Walgreens', 'CVS'],
      misc: ['Shopping', 'Goods', 'Groceries', '04/12/2024'],
    };
    // } catch (error) {
    //   throw error;
    // }
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
            items = await this.shoppingListRepository.getByStoreId(store.id);
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
