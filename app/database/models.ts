import {associations, Model, Query, Relation} from '@nozbe/watermelondb';
import {
  children,
  date,
  field,
  immutableRelation,
  relation,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import {Columns, Tables} from './schema';

//Docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#definite-assignment-assertions

export type Status = 'active' | 'archived' | 'deleted' | 'pinned' | 'draft';
//#region DAOStores
const DAOStoresColumns = Columns.stores;
export class DAOStores extends Model {
  static table = Tables.stores;
  static associations = associations([
    Tables.shoppingListItems,
    {type: 'has_many', foreignKey: Columns.shoppingListItems.storeId},
  ]);

  @text(DAOStoresColumns.name)
  name!: string;

  @text(DAOStoresColumns.cloudId)
  cloudId!: string | undefined;
  /**
   * Make sure to use one of these statues {@link Status}
   */
  @text(DAOStoresColumns.status)
  status!: string;
  @date(DAOStoresColumns.createdAt) createdAt!: Date;
  @date(DAOStoresColumns.updatedAt) updatedAt!: Date;

  @children(Tables.shoppingListItems)
  shoppingListItems!: Query<DAOShoppingListItems>;

  @writer async updateStore(
    name: string,
    cloudId?: string,
  ): Promise<DAOStores> {
    return await this.update(_store => {
      _store.name = name;
      _store.cloudId = cloudId;
    });
  }

  @writer async markAs(status: Status): Promise<DAOStores> {
    return await this.update(_store => {
      _store.status = status;
    });
  }
}
//#endregion

//#region DAOShoppingListItems
export type ShoppingListItemsStatus = 'active' | 'deleted';
const ShoppingListItemsColumns = Columns.shoppingListItems;
export class DAOShoppingListItems extends Model {
  static table = Tables.shoppingListItems;
  static associations = associations([
    Tables.stores,
    {type: 'belongs_to', key: Columns.shoppingListItems.storeId},
  ]);

  /**
   * Make sure to use one of these statues {@link Status}
   */
  @text(ShoppingListItemsColumns.status)
  status!: string;

  @relation(Tables.products, ShoppingListItemsColumns.productId)
  product!: Relation<DAOProducts>;

  @relation(Tables.categories, ShoppingListItemsColumns.categoryId)
  category!: Relation<DAOCategories>;

  @text(ShoppingListItemsColumns.storeId)
  storeId!: string;
  @field(ShoppingListItemsColumns.quantity) quantity!: number;
  @text(ShoppingListItemsColumns.unit) unit!: string;
  @field(ShoppingListItemsColumns.checked) checked!: boolean;
  @date(ShoppingListItemsColumns.createdAt) createdAt!: Date;
  @date(ShoppingListItemsColumns.updatedAt) updatedAt!: Date;

  @immutableRelation(Tables.stores, ShoppingListItemsColumns.storeId)
  store!: Relation<DAOStores>;

  @writer async markAs(
    status: ShoppingListItemsStatus,
  ): Promise<DAOShoppingListItems> {
    return await this.update(_shoppingListItem => {
      _shoppingListItem.status = status;
    });
  }

  @writer async updateShoppingListItem(
    checked: boolean,
    quantity: number,
    unit: string,
    productId: string,
    categoriesId?: string,
    status: string = 'active',
  ): Promise<DAOShoppingListItems> {
    return await this.update(item => {
      item.product.id = productId;
      item.checked = checked;
      item.quantity = quantity;
      item.unit = unit;
      item.category.id = categoriesId;
      item.status = status;
    });
  }

  @writer async toggleItem(checked: boolean): Promise<DAOShoppingListItems> {
    return await this.update(item => {
      item.checked = checked;
    });
  }

  @writer async delete(): Promise<void> {
    return await this.destroyPermanently();
  }
}
//#endregion

//#region DAOProducts
const ProductsColumn = Columns.products;
export class DAOProducts extends Model {
  static table = Tables.products;
  @text(ProductsColumn.name)
  name!: string;
  @date(ProductsColumn.createdAt) createdAt!: Date;
  @date(ProductsColumn.updatedAt) updatedAt!: Date;
}
//#endregion

//#region DAO Category
const CategoriesColumn = Columns.categories;
export class DAOCategories extends Model {
  static table = Tables.categories;
  @text(CategoriesColumn.color)
  color!: string;
  @date(CategoriesColumn.createdAt) createdAt!: Date;
  @date(CategoriesColumn.updatedAt) updatedAt!: Date;
}
//#endregion
