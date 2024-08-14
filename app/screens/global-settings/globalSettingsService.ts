import {AuthRepository} from '@/model/authRepository';
import {KUser} from '@/model/types';

export interface GlobalSettingsService {
  getActiveSession(): Promise<KUser | undefined>;
  logOut(): Promise<void>;
}

export class GlobalSettingsServiceImpl implements GlobalSettingsService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
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
      return await this.authRepository.logOut();
    } catch (error) {
      throw error;
    }
  }
}
