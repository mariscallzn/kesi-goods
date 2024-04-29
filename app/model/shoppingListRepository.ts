import {Database, Q} from '@nozbe/watermelondb';
import {ShoppingListItem} from './types';
import {DAOShoppingListItems, DAOStores} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {asc} from '@nozbe/watermelondb/QueryDescription';

export interface ShoppingListRepository {
  getByStoreId(storeId: string): Promise<ShoppingListItem[]>;
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
          product: daoProduct,
          category: daoCategory,
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
      const item = await this.update(shoppingListItem);
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
      return {
        id: dao.id,
        checked: dao.checked,
        product: await dao.product,
        category: await dao.category,
        quantity: dao.quantity,
        unit: dao.unit,
      };
    } catch (error) {
      throw error;
    }
  }

  private async update(
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem | undefined> {
    try {
      const daoItem = await this.database
        .get<DAOShoppingListItems>(Tables.shoppingListItems)
        .find(shoppingListItem.id);
      const daoUpdated = await daoItem.updateShoppingListItem(
        shoppingListItem.checked,
        shoppingListItem.quantity,
        shoppingListItem.unit,
        shoppingListItem.product.id,
        shoppingListItem.category?.id,
      );
      return {
        id: daoUpdated.id,
        checked: daoUpdated.checked,
        unit: daoUpdated.unit,
        quantity: daoUpdated.quantity,
        product: await daoUpdated.product,
        category: await daoUpdated.category,
      };
    } catch (error) {
      return;
    }
  }
}
