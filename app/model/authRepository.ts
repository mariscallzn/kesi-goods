import {getCurrentUser, signOut} from 'aws-amplify/auth';
import {KUser} from './types';

export interface AuthRepository {
  getUser(): Promise<KUser | undefined>;
  logOut(): Promise<void>;
}

export class AuthRepositoryImpl implements AuthRepository {
  async getUser(): Promise<KUser | undefined> {
    try {
      const user = await getCurrentUser();
      return {email: user.signInDetails?.loginId ?? 'User'};
    } catch (error) {
      //TODO: Add Logs
      return;
    }
  }

  async logOut(): Promise<void> {
    return await signOut();
  }
}
