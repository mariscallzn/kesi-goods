import {Database, Q} from '@nozbe/watermelondb';
import {DAOStores, Status} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {Store} from './types';

export interface StoresRepository {
  getById(id: string): Promise<Store>;
  fetch(statues?: Status[]): Promise<Store[]>;
  addOrUpdate(store: Store): Promise<Store>;
  markAsDelete(store: Store): Promise<Store>;
  restore(store: Store): Promise<Store>;
  destroyRecords(statues?: Status[]): Promise<void>;
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

  async fetch(statues?: Status[]): Promise<Store[]> {
    try {
      const stores: Store[] = [];
      const queries: Q.Where[] = [];

      if (statues) {
        statues.forEach(s => queries.push(Q.where(Columns.stores.status, s)));
      }

      const daoStoresTable = this.database.get<DAOStores>(Tables.stores);

      const daoStores =
        queries.length >= 1
          ? await daoStoresTable.query(Q.or(queries)).fetch()
          : await daoStoresTable
              .query(
                Q.where(
                  Columns.stores.status,
                  Q.notIn(['deleted', 'archived']),
                ),
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
      await daoStore.markAs('deleted');
      return store;
    } catch (error) {
      throw error;
    }
  }

  async restore(store: Store): Promise<Store> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(store.id);
      await daoStore.markAs('active');
      return store;
    } catch (error) {
      throw error;
    }
  }

  async destroyRecords(statues?: Status[]): Promise<void> {
    try {
      const queries: Q.Where[] = [];

      if (statues) {
        statues.forEach(s => queries.push(Q.where(Columns.stores.status, s)));
      }

      const storesTable = this.database.get<DAOStores>(Tables.stores);
      const stores =
        queries.length >= 1
          ? await storesTable.query(Q.or(queries)).fetch()
          : await storesTable.query().fetch();

      for (const store of stores) {
        await store.destroyWithChildren();
      }

      return;
    } catch (error) {
      throw error;
    }
  }
}
