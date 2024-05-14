import {Database, Q} from '@nozbe/watermelondb';
import {ShoppingListItem} from './types';
import {DAOShoppingListItems, DAOStores} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {asc} from '@nozbe/watermelondb/QueryDescription';

export interface ShoppingListRepository {
  getByStoreId(storeId: string): Promise<ShoppingListItem[]>;
  getUncheckedItemsByStoreId(storeId: string): Promise<ShoppingListItem[]>;
  getCheckedByStoreId(storeId: string): Promise<ShoppingListItem[]>;
  addOrUpdate(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem>;
  toggleShoppingListItemById(id: string, value: boolean): Promise<void>;
}

export class DatabaseShoppingListRepository implements ShoppingListRepository {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async getByStoreId(storeId: string): Promise<ShoppingListItem[]> {
    try {
      const daoStore = await this.database
        .get<DAOStores>(Tables.stores)
        .find(storeId);

      const daoShoppingListItems = await daoStore.shoppingListItems.extend(
        Q.sortBy(Columns.shoppingListItems.checked, asc),
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
      console.log(JSON.stringify(shoppingListItems));

      return shoppingListItems;
    } catch (error) {
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
      };
    } catch (error) {
      return;
    }
  }
}
