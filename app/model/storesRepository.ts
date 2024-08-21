import {Database, Q} from '@nozbe/watermelondb';
import {DAOStores} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {Store} from './types';

export interface StoresRepository {
  getById(id: string): Promise<Store>;
  fetch(): Promise<Store[]>;
  addOrUpdate(store: Store): Promise<Store>;
  markAsDelete(store: Store): Promise<Store>;
  restore(store: Store): Promise<Store>;
  destroyRecords(): Promise<void>;
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
        cloudId: daoStore.cloudId,
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
        .query(
          Q.where(Columns.stores.status, Q.notIn(['deleted', 'archived'])),
          Q.sortBy(Columns.stores.createdAt, Q.desc),
          Q.sortBy(Columns.stores.status, Q.desc),
        )
        .fetch();
      for (const store of daoStores) {
        const daoItems = await store.shoppingListItems
          .extend(Q.where(Columns.shoppingListItems.status, Q.eq('active')))
          .fetch();
        stores.push({
          id: store.id,
          name: store.name,
          cloudId: store.cloudId,
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
        let daoStore: DAOStores;
        if (
          (store.id === 'n/a' || store.id.length === 0) &&
          store.cloudId &&
          store.cloudId.length > 0
        ) {
          const syncStore = await this.database
            .get<DAOStores>(Tables.stores)
            .query(Q.where(Columns.stores.cloudId, Q.eq(store.cloudId)))
            .fetch();

          if (syncStore.length === 0) {
            throw new Error(`CloudId ${store.cloudId} not found`);
          } else {
            daoStore = syncStore[0];
          }
        } else {
          daoStore = await this.database
            .get<DAOStores>(Tables.stores)
            .find(store.id);
        }

        const updatedStore = await daoStore.updateStore(
          store.name,
          store.cloudId,
        );

        _store = {
          ...store,
          name: updatedStore.name,
          cloudId: updatedStore.cloudId,
        };
      } catch (error) {
        //Create Store
        const newStore = await this.database.write(async () => {
          return await this.database
            .get<DAOStores>(Tables.stores)
            .create(_newStore => {
              _newStore.name = store.name;
              _newStore.cloudId = store.cloudId;
            });
        });
        _store = {
          id: newStore.id,
          name: newStore.name,
          cloudId: newStore.cloudId,
          checkedItems: 0,
          totalItems: 0,
        };
      }
      return _store;
    } catch (error) {
      throw error;
    }
  }

  async markAsDelete(store: Store): Promise<Store> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(store.id);
      const updatedDaoStore = await daoStore.markAs('deleted');
      return {id: updatedDaoStore.id, name: updatedDaoStore.name};
    } catch (error) {
      throw error;
    }
  }

  async restore(store: Store): Promise<Store> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(store.id);
      const updatedDaoStore = await daoStore.markAs('active');
      return {id: updatedDaoStore.id, name: updatedDaoStore.name};
    } catch (error) {
      throw error;
    }
  }

  async destroyRecords(): Promise<void> {
    try {
      return await this.database.write(async () => {
        const stores = await this.database
          .get<DAOStores>(Tables.stores)
          .query();
        for (const store of stores) {
          await store.destroyPermanently();
        }
        return;
      });
    } catch (error) {
      throw error;
    }
  }
}
