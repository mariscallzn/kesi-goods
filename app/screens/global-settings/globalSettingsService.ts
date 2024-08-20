import {AuthRepository} from '@/model/authRepository';
import {ShoppingListRepository} from '@/model/shoppingListRepository';
import {StoresRepository} from '@/model/storesRepository';
import {KUser} from '@/model/types';

export interface GlobalSettingsService {
  getActiveSession(): Promise<KUser | undefined>;
  logOut(): Promise<void>;
}

export class GlobalSettingsServiceImpl implements GlobalSettingsService {
  private readonly authRepository: AuthRepository;
  private readonly storeRepository: StoresRepository;
  private readonly shoppingListRepository: ShoppingListRepository;

  constructor(
    authRepository: AuthRepository,
    storeRepo: StoresRepository,
    shoppingListRepo: ShoppingListRepository,
  ) {
    this.authRepository = authRepository;
    this.storeRepository = storeRepo;
    this.shoppingListRepository = shoppingListRepo;
  }

  async getActiveSession(): Promise<KUser | undefined> {
    try {
      return await this.authRepository.getUser();
    } catch (error) {
      throw error;
    }
  }

  async logOut(): Promise<void> {
    try {
      await this.authRepository.logOut();
      await this.shoppingListRepository.destroyRecords();
      await this.storeRepository.destroyRecords();
      return;
    } catch (error) {
      throw error;
    }
  }
}
