import {StoresRepository} from '../../model/storesRepository';
import {Store} from '../../model/types';
import {getUUID} from '../../utils/misc';
import {VIEW_ID} from './components/content/types';
import {ListSuggestions, UIStore} from './types';

export interface StoresService {
  getStores(): Promise<UIStore[]>;
  createOrUpdate(store: Store): Promise<UIStore>;
  fetchListSuggestions(): Promise<ListSuggestions>;
}

export class StoresServiceImpl implements StoresService {
  private readonly storesRepository: StoresRepository;

  constructor(storesRepository: StoresRepository) {
    this.storesRepository = storesRepository;
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
}
