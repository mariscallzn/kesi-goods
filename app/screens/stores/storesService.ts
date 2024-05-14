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
  copyStoreList(store: Store, copyOption: CopyListOption): Promise<void>;
  markStoreListAsDelete(store: Store): Promise<void>;
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

  async copyStoreList(store: Store, copyOption: CopyListOption): Promise<void> {
    try {
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
          items = await this.shoppingListRepository.getUncheckedItemsByStoreId(
            store.id,
          );
          break;
      }

      const copyStore = await this.storesRepository.addOrUpdate({
        id: '',
        name: `${store.name} Copy`,
      });

      for (const item of items) {
        await this.shoppingListRepository.addOrUpdate(copyStore.id, {
          ...item,
          checked: false,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async markStoreListAsDelete(store: Store): Promise<void> {
    return await this.storesRepository.markAsDelete(store);
  }
}
