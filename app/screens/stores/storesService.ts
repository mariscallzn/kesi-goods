import {StoresRepository} from '../../model/storesRepository';
import {Store} from '../../model/types';

export interface StoresService {
  getStores(): Promise<Store[]>;
  createOrUpdate(store: Store): Promise<Store>;
}

export class StoresServiceImpl implements StoresService {
  private readonly storesRepository: StoresRepository;

  constructor(storesRepository: StoresRepository) {
    this.storesRepository = storesRepository;
  }
  getStores(): Promise<Store[]> {
    try {
      return this.storesRepository.fetch();
    } catch (error) {
      throw error;
    }
  }
  createOrUpdate(store: Store): Promise<Store> {
    try {
      //TODO: Add validations
      return this.storesRepository.addOrUpdate(store);
    } catch (error) {
      throw error;
    }
  }
}
