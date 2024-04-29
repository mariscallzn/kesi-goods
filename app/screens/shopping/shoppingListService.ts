import {CategoryRepository} from '../../model/categoryRepository';
import {ProductRepository} from '../../model/productRepository';
import {ShoppingListRepository} from '../../model/shoppingListRepository';
import {Category, ShoppingListItem} from '../../model/types';

export interface ShoppingListService {
  getShoppingListByStore(storeId: string): Promise<ShoppingListItem[]>;
  createOrUpdateShoppingListItem(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem>;
}

export class ShoppingListServiceImpl implements ShoppingListService {
  private readonly shoppingListRepository: ShoppingListRepository;
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;

  constructor(
    shoppingListRepository: ShoppingListRepository,
    productRepository: ProductRepository,
    categoryRepository: CategoryRepository,
  ) {
    this.shoppingListRepository = shoppingListRepository;
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  async getShoppingListByStore(storeId: string): Promise<ShoppingListItem[]> {
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

      return categorizedItems
        .sort((a, b) => a.category!!.color.localeCompare(b.category!!.color))
        .concat(undefinedCategoryItems, checkItems);
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdateShoppingListItem(
    storeId: string,
    shoppingListItem: ShoppingListItem,
  ): Promise<ShoppingListItem> {
    const product = await this.productRepository.findOrCreate(
      shoppingListItem.product,
    );

    let category: Category | undefined;
    if (shoppingListItem.category) {
      category = await this.categoryRepository.findOrCreate(
        shoppingListItem.category,
      );
    }

    return this.shoppingListRepository.addOrUpdate(storeId, {
      ...shoppingListItem,
      product: product,
      category: category,
    });
  }
}
