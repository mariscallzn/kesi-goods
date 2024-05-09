import {Database} from '@nozbe/watermelondb';
import {DAOStores} from '../database/models';
import {Tables} from '../database/schema';
import {Store} from './types';

export interface StoresRepository {
  getById(id: string): Promise<Store>;
  fetch(): Promise<Store[]>;
  addOrUpdate(store: Store): Promise<Store>;
}

export class DatabaseStoresRepository implements StoresRepository {
  private readonly database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  async getById(id: string): Promise<Store> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(id);
      return {
        id: daoStore.id,
        name: daoStore.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async fetch(): Promise<Store[]> {
    try {
      const stores: Store[] = [];
      const daoStores = await this.database
        .get<DAOStores>(Tables.stores)
        .query()
        .fetch();
      for (const store of daoStores) {
        const daoItems = await store.shoppingListItems.fetch();
        stores.push({
          id: store.id,
          name: store.name,
          checkedItems: daoItems.filter(f => f.checked === true).length,
          totalItems: daoItems.length,
        });
      }
      return stores;
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdate(store: Store): Promise<Store> {
    try {
      let _store: Store;

      //database.find rejects the promise if it's not found, which force us
      //to have this nested try-catch
      try {
        //Update Store
        const daoStore = await this.database
          .get<DAOStores>(Tables.stores)
          .find(store.id);
        const updatedStore = await daoStore.updateStore(store.name);
        _store = {...store, name: updatedStore.name};
      } catch (error) {
        //Create Store
        const newStore = await this.database.write(async () => {
          return await this.database
            .get<DAOStores>(Tables.stores)
            .create(_newStore => {
              _newStore.name = store.name;
            });
        });

        _store = {
          id: newStore.id,
          name: newStore.name,
          checkedItems: 0,
          totalItems: 0,
        };
      }
      return _store;
    } catch (error) {
      throw error;
    }
  }
}
