import {StoreApi} from '@/api/storesApi';
import {VIEW_ID} from './components/content/types';
import {ListInfo, RESTORE_TYPE, UIUncheckedItem} from './types';
import {ShoppingListRepository} from '@/model/shoppingListRepository';
import {ProductRepository} from '@/model/productRepository';
import {CategoryRepository} from '@/model/categoryRepository';
import {StoresRepository} from '@/model/storesRepository';
import {Category, Product, ShoppingListItem} from '@/model/types';
import {UnknownMetadata} from '@/utils/types';
import {getUUID, safeDivision} from '@/utils/misc';

export interface ShoppingListService {
  getShoppingListByStore(
    storeId: string,
    searchTerm?: string,
  ): Promise<ListInfo>;
  createOrUpdateShoppingListItem(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<UIUncheckedItem>;
  fetchCategories(): Promise<Category[]>;
  findByNameOrFetch(name?: string): Promise<Product[]>;
  toggleShoppingListItemById(id: string, value: boolean): Promise<void>;
  markShoppingListItemAsDeleted(
    item: ShoppingListItem,
  ): Promise<ShoppingListItem>;
  markCheckedItemsAsDeleted(storeId: string): Promise<ShoppingListItem[]>;
  uncheckAllListItems(storeId: string): Promise<ShoppingListItem[]>;
  restoreShoppingList(metadata: UnknownMetadata): Promise<void>;
}

export class ShoppingListServiceImpl implements ShoppingListService {
  private readonly shoppingListRepository: ShoppingListRepository;
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly storeRepository: StoresRepository;
  private readonly storeApi: StoreApi;

  constructor(
    shoppingListRepository: ShoppingListRepository,
    productRepository: ProductRepository,
    categoryRepository: CategoryRepository,
    storeRepository: StoresRepository,
    storeApi: StoreApi,
  ) {
    this.shoppingListRepository = shoppingListRepository;
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.storeRepository = storeRepository;
    this.storeApi = storeApi;
  }

  async getShoppingListByStore(
    storeId: string,
    searchTerm?: string,
  ): Promise<ListInfo> {
    try {
      let listName = '';
      let productIds: string[] | undefined;
      try {
        listName = (await this.storeRepository.getById(storeId)).name;
      } catch (error) {
        //TODO:
        // - Fetch from API
        // - Map products because this is a shared list
        // - Save ShoppingList Items on new list
        // this.productRepository.findOrCreateByName()
        // This could be a function because the observer will do the same and override all what local DB has
        //Think about the cloudId property you added
      }

      if (searchTerm) {
        productIds = (
          await this.productRepository.findByNameOrFetch(searchTerm)
        )
          .filter(e => e.id !== 'n/a')
          .map(e => e.id);
      }

      const shoppingListItems = await this.shoppingListRepository.getByStoreId(
        storeId,
        ['active'],
        productIds,
      );

      const checkItems: ShoppingListItem[] = [];
      const undefinedCategoryItems: ShoppingListItem[] = [];
      const categorizedItems: ShoppingListItem[] = [];

      shoppingListItems.forEach(item => {
        if (item.checked) {
          checkItems.push(item);
        } else if (!item.category?.color || item.category?.color === '') {
          undefinedCategoryItems.push(item);
        } else {
          categorizedItems.push(item);
        }
      });

      const uncheckedCombined = categorizedItems
        .sort((a, b) => a.category!!.color.localeCompare(b.category!!.color))
        .concat(undefinedCategoryItems);

      const uncheckedFormatted = uncheckedCombined.map(
        (item, index) =>
          ({
            id: getUUID(),
            type: VIEW_ID.uncheckedItem,
            shoppingListItem: item,
            itemLocation:
              index === 0
                ? 'head'
                : index === uncheckedCombined.length - 1
                ? 'tail'
                : 'body',
          } as UIUncheckedItem),
      );

      const checkedFormatted = checkItems.map(
        (item, index) =>
          ({
            id: getUUID(),
            type: VIEW_ID.checkedItem,
            shoppingListItem: item,
            itemLocation:
              index === 0
                ? 'head'
                : index === uncheckedCombined.length - 1
                ? 'tail'
                : 'body',
          } as UIUncheckedItem),
      );

      const listInfo: ListInfo = {
        listName: listName,
        shoppingListItems: uncheckedFormatted.concat(checkedFormatted),
        progress: safeDivision(checkItems.length, shoppingListItems.length),
      };

      return listInfo;
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdateShoppingListItem(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<UIUncheckedItem> {
    try {
      const product = await this.productRepository.findOrCreateById(
        shoppingListItem.product,
      );

      let category: Category | undefined;
      if (shoppingListItem.category) {
        category = await this.categoryRepository.findOrCreate(
          shoppingListItem.category,
        );
      }

      const _shoppingListItem = await this.shoppingListRepository.addOrUpdate(
        storeId,
        {
          ...shoppingListItem,
          product: product,
          category: category,
        },
      );

      return {
        id: getUUID(),
        shoppingListItem: _shoppingListItem,
        type: VIEW_ID.uncheckedItem,
        itemLocation: 'tail',
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.fetch();
    } catch (error) {
      throw error;
    }
  }

  async findByNameOrFetch(name?: string | undefined): Promise<Product[]> {
    try {
      return await this.productRepository.findByNameOrFetch(name);
    } catch (error) {
      throw error;
    }
  }

  async toggleShoppingListItemById(id: string, value: boolean): Promise<void> {
    try {
      return await this.shoppingListRepository.toggleShoppingListItemById(
        id,
        value,
      );
    } catch (error) {
      throw error;
    }
  }

  async markShoppingListItemAsDeleted(
    item: ShoppingListItem,
  ): Promise<ShoppingListItem> {
    try {
      return await this.shoppingListRepository.markAsDeleted(item);
    } catch (error) {
      throw error;
    }
  }

  async markCheckedItemsAsDeleted(
    storeId: string,
  ): Promise<ShoppingListItem[]> {
    try {
      const items: ShoppingListItem[] =
        await this.shoppingListRepository.getCheckedByStoreId(storeId);
      for (const item of items) {
        await this.shoppingListRepository.markAsDeleted(item);
      }
      return items;
    } catch (error) {
      throw error;
    }
  }

  async uncheckAllListItems(storeId: string): Promise<ShoppingListItem[]> {
    try {
      const items: ShoppingListItem[] =
        await this.shoppingListRepository.getCheckedByStoreId(storeId);
      for (const item of items) {
        await this.toggleShoppingListItemById(item.id, false);
      }
      return items;
    } catch (error) {
      throw error;
    }
  }

  async restoreShoppingList(metadata: UnknownMetadata): Promise<void> {
    try {
      const shoppingListItems: ShoppingListItem[] =
        metadata.value as ShoppingListItem[];
      for (const item of shoppingListItems) {
        switch (metadata.type) {
          case RESTORE_TYPE.restoreUnchecked:
            await this.toggleShoppingListItemById(item.id, true);
            break;

          case RESTORE_TYPE.restoreDeleted:
            await this.shoppingListRepository.restore(item);
            break;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
