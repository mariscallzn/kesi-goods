import {Database, Q} from '@nozbe/watermelondb';
import {asc} from '@nozbe/watermelondb/QueryDescription';
import {DAOShoppingListItems, DAOStores, Status} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {ShoppingListItem} from './types';

export interface ShoppingListRepository {
  getByStoreId(
    storeId: string,
    statues: Status[],
    productsIds?: string[],
  ): Promise<ShoppingListItem[]>;
  getUncheckedItemsByStoreId(storeId: string): Promise<ShoppingListItem[]>;
  getCheckedByStoreId(storeId: string): Promise<ShoppingListItem[]>;
  addOrUpdate(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem>;
  toggleShoppingListItemById(id: string, value: boolean): Promise<void>;
  markAsDeleted(shoppingListItem: ShoppingListItem): Promise<ShoppingListItem>;
  destroy(id: string): Promise<void>;
  restore(shoppingListItem: ShoppingListItem): Promise<void>;
}

export class DatabaseShoppingListRepository implements ShoppingListRepository {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async getByStoreId(
    storeId: string,
    statues: Status[] = ['active'],
    productsIds?: string[],
  ): Promise<ShoppingListItem[]> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(storeId);

      const query: Q.Clause[] = [];
      query.push(Q.sortBy(Columns.shoppingListItems.checked, asc));

      const queryOr: Q.Where[] = [];
      for (const status of statues) {
        queryOr.push(Q.where(Columns.shoppingListItems.status, Q.eq(status)));
      }
      query.push(Q.or(queryOr));

      if (productsIds) {
        query.push(
          Q.where(Columns.shoppingListItems.productId, Q.oneOf(productsIds)),
        );
      }

      const daoShoppingListItems = await daoStore.shoppingListItems.extend(
        query,
      );

      const shoppingListItems: ShoppingListItem[] = [];

      for (const daoItem of daoShoppingListItems) {
        const daoProduct = await daoItem.product.fetch();
        const daoCategory = await daoItem.category.fetch();
        shoppingListItems.push({
          id: daoItem.id,
          product: {id: daoProduct.id, name: daoProduct.name},
          category: {id: daoCategory?.id, color: daoCategory?.color},
          checked: daoItem.checked,
          quantity: daoItem.quantity,
          unit: daoItem.unit,
        });
      }
      return shoppingListItems;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async getUncheckedItemsByStoreId(
    storeId: string,
  ): Promise<ShoppingListItem[]> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(storeId);

      const daoShoppingListItems = await daoStore.shoppingListItems.extend(
        Q.where(Columns.shoppingListItems.checked, Q.eq(false)),
      );

      const shoppingListItems: ShoppingListItem[] = [];

      for (const daoItem of daoShoppingListItems) {
        const daoProduct = await daoItem.product.fetch();
        const daoCategory = await daoItem.category.fetch();
        shoppingListItems.push({
          id: daoItem.id,
          product: {id: daoProduct.id, name: daoProduct.name},
          category: {id: daoCategory?.id, color: daoCategory?.color},
          checked: daoItem.checked,
          quantity: daoItem.quantity,
          unit: daoItem.unit,
        });
      }

      return shoppingListItems;
    } catch (error) {
      throw error;
    }
  }

  async getCheckedByStoreId(storeId: string): Promise<ShoppingListItem[]> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(storeId);

      const daoShoppingListItems = await daoStore.shoppingListItems.extend(
        Q.where(Columns.shoppingListItems.checked, Q.eq(true)),
      );

      const shoppingListItems: ShoppingListItem[] = [];

      for (const daoItem of daoShoppingListItems) {
        const daoProduct = await daoItem.product.fetch();
        const daoCategory = await daoItem.category.fetch();
        shoppingListItems.push({
          id: daoItem.id,
          product: {id: daoProduct.id, name: daoProduct.name},
          category: {id: daoCategory?.id, color: daoCategory?.color},
          checked: daoItem.checked,
          quantity: daoItem.quantity,
          unit: daoItem.unit,
        });
      }

      return shoppingListItems;
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdate(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem> {
    try {
      let _shoppingListItem: ShoppingListItem;
      const item = await this.update(storeId, shoppingListItem);
      if (item) {
        _shoppingListItem = item;
      } else {
        _shoppingListItem = await this.save(storeId, shoppingListItem);
      }
      return _shoppingListItem;
    } catch (error) {
      throw error;
    }
  }

  async toggleShoppingListItemById(id: string, value: boolean): Promise<void> {
    try {
      const daoShoppingListItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(id);
      await daoShoppingListItem.toggleItem(value);
    } catch (error) {
      throw error;
    }
  }

  private async save(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem> {
    try {
      const dao = await this.database.write(async () => {
        return await this.database
          .get<DAOShoppingListItems>(Tables.shoppingListItems)
          .create(_dao => {
            _dao.checked = shoppingListItem.checked;
            _dao.quantity = shoppingListItem.quantity;
            _dao.unit = shoppingListItem.unit;
            _dao.product.id = shoppingListItem.product.id;
            _dao.store.id = storeId;
            _dao.category.id = shoppingListItem.category?.id;
            _dao.status = shoppingListItem.status
              ? shoppingListItem.status
              : 'active';
          });
      });
      const daoProduct = await dao.product;
      const daoCategory = await dao.category;
      return {
        id: dao.id,
        checked: dao.checked,
        product: {id: daoProduct.id, name: daoProduct.name},
        category: {id: daoCategory?.id, color: daoCategory?.color},
        quantity: dao.quantity,
        unit: dao.unit,
        status: dao.status as Status,
      };
    } catch (error) {
      throw error;
    }
  }

  private async update(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem | undefined> {
    try {
      const daoItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(shoppingListItem.id);

      // If daoItem.storeId is not eq storeId it means that the items
      // are being copied, so we return undefine to allow save() to create them
      if (daoItem.storeId !== storeId) {
        return;
      }

      const daoUpdated = await daoItem.updateShoppingListItem(
        shoppingListItem.checked,
        shoppingListItem.quantity,
        shoppingListItem.unit,
        shoppingListItem.product.id,
        shoppingListItem.category?.id,
        shoppingListItem.status ? shoppingListItem.status : 'active',
      );

      const daoProduct = await daoUpdated.product;
      const daoCategory = await daoUpdated.category;

      return {
        id: daoUpdated.id,
        checked: daoUpdated.checked,
        unit: daoUpdated.unit,
        quantity: daoUpdated.quantity,
        product: {id: daoProduct.id, name: daoProduct.name},
        category: {id: daoCategory?.id, color: daoCategory?.color},
        status: daoUpdated.status as Status,
      };
    } catch (error) {
      return;
    }
  }

  async markAsDeleted(
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem> {
    try {
      const daoShoppingListItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(shoppingListItem.id);
      const updatedItem = await daoShoppingListItem.markAs('deleted');
      const product = await updatedItem.product;
      const category = await updatedItem.category;
      return {
        id: updatedItem.id,
        checked: updatedItem.checked,
        quantity: updatedItem.quantity,
        unit: updatedItem.unit,
        product: {id: product.id, name: product.name},
        category: category
          ? {id: category.id, color: category.color}
          : undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  async destroy(id: string): Promise<void> {
    try {
      const daoShoppingListItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(id);
      await this.database.write(async () => {
        await daoShoppingListItem.destroyPermanently();
      });
    } catch (error) {
      throw error;
    }
  }

  async restore(shoppingListItem: ShoppingListItem): Promise<void> {
    try {
      const daoShoppingListItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(shoppingListItem.id);
      await daoShoppingListItem.markAs('active');
    } catch (error) {
      throw error;
    }
  }
}
