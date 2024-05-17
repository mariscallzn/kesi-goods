import {CategoryRepository} from '../../model/categoryRepository';
import {ProductRepository} from '../../model/productRepository';
import {ShoppingListRepository} from '../../model/shoppingListRepository';
import {StoresRepository} from '../../model/storesRepository';
import {Category, Product, ShoppingListItem} from '../../model/types';
import {getUUID, saveDivision} from '../../utils/misc';
import {VIEW_ID} from './components/content/types';
import {ListInfo, UIUncheckedItem} from './types';

export interface ShoppingListService {
  getShoppingListByStore(storeId: string): Promise<ListInfo>;
  createOrUpdateShoppingListItem(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<UIUncheckedItem>;
  fetchCategories(): Promise<Category[]>;
  findByNameOrFetch(name?: string): Promise<Product[]>;
  toggleShoppingListItemById(id: string, value: boolean): Promise<void>;
}

export class ShoppingListServiceImpl implements ShoppingListService {
  private readonly shoppingListRepository: ShoppingListRepository;
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly storeRepository: StoresRepository;

  constructor(
    shoppingListRepository: ShoppingListRepository,
    productRepository: ProductRepository,
    categoryRepository: CategoryRepository,
    storeRepository: StoresRepository,
  ) {
    this.shoppingListRepository = shoppingListRepository;
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.storeRepository = storeRepository;
  }

  async getShoppingListByStore(storeId: string): Promise<ListInfo> {
    try {
      const shoppingListItems = await this.shoppingListRepository.getByStoreId(
        storeId,
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
        listName: (await this.storeRepository.getById(storeId)).name,
        shoppingListItems: uncheckedFormatted.concat(checkedFormatted),
        progress: saveDivision(checkItems.length, shoppingListItems.length),
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
      const product = await this.productRepository.findOrCreate(
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
    return await this.categoryRepository.fetch();
  }

  async findByNameOrFetch(name?: string | undefined): Promise<Product[]> {
    return await this.productRepository.findByNameOrFetch(name);
  }

  async toggleShoppingListItemById(id: string, value: boolean): Promise<void> {
    return await this.shoppingListRepository.toggleShoppingListItemById(
      id,
      value,
    );
  }
}
