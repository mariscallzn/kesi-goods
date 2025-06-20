import {Action} from '../../inf/types';
import {CategoryRepository} from '../../model/categoryRepository';
import {ProductRepository} from '../../model/productRepository';
import {ShoppingListRepository} from '../../model/shoppingListRepository';
import {Product, ShoppingListItem} from '../../model/types';
import {getUUID} from '../../utils/misc';
import {IView} from './components/content/types';
import {InitData} from './redux-slice/types';
import {UIProduct} from './types';

export interface ProductService {
  init(listId: string): Promise<InitData>;
  fetchProducts(listId: string, searchTerm?: string): Promise<UIProduct[]>;
  updateItemsByAction(
    listId: string,
    snapshot: ShoppingListItem[],
    action: Action,
    items: IView[],
  ): Promise<IView[]>;
  addSelection(listId: string): Promise<void>;
  deleteDraftItemsByList(
    listId: string,
    snapshot: ShoppingListItem[],
  ): Promise<void>;
}

export class ProductServiceImpl implements ProductService {
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

  async init(listId: string): Promise<InitData> {
    try {
      const snapshot = await this.shoppingListRepository.getByStoreId(listId, [
        'active',
      ]);
      const items = await this.fetchProducts(listId);
      return {
        items: items,
        snapshot: snapshot,
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchProducts(
    listId: string,
    searchTerm?: string | undefined,
  ): Promise<UIProduct[]> {
    try {
      const _searchTerm = searchTerm?.trim();
      const categories = await this.categoryRepository.fetch();
      //TODO: We should read some setting to know which metric system to load
      const units = ['gal', 'oz', 'lb', 'pkg'];
      const products: Product[] =
        await this.productRepository.findByNameOrFetch(_searchTerm);

      const shoppingListItems = await this.shoppingListRepository.getByStoreId(
        listId,
        ['draft', 'active'],
        products.map(e => e.id),
      );

      //Products that exists on the shopping list already goes in the top
      const existingItems = [
        ...shoppingListItems.map<UIProduct>(e => ({
          id: getUUID(),
          shoppingListId: e.id,
          type: 'productItem',
          product: e.product,
          checked: e.checked,
          selectedCategory: e.category,
          quantity: e.quantity,
          selectedUnit: e.unit,
          categories: categories,
          units: units,
        })),
      ];

      const dbProducts = products.map<UIProduct>(e => ({
        shoppingListId: 'invalid',
        id: getUUID(),
        type: 'productItem',
        product: e,
        checked: false,
        categories: categories,
        units: units,
        quantity: undefined,
      }));

      let uiProducts: UIProduct[] = [
        ...existingItems,
        ...dbProducts.filter(
          e => !existingItems.some(_e => e.product.id === _e.product.id),
        ),
      ];

      if (
        (_searchTerm &&
          products.length > 0 &&
          products[0].name !== _searchTerm) ||
        (_searchTerm && products.length === 0)
      ) {
        uiProducts = [
          {
            shoppingListId: 'invalid',
            id: getUUID(),
            type: 'productItem',
            product: {id: 'n/a', name: _searchTerm},
            checked: false,
            categories: categories,
            units: units,
            quantity: undefined,
          } as UIProduct,
          ...uiProducts,
        ];
      }
      return uiProducts;
    } catch (error) {
      throw error;
    }
  }

  async updateItemsByAction(
    listId: string,
    snapshot: ShoppingListItem[],
    action: Action,
    items: IView[],
  ): Promise<IView[]> {
    try {
      const incomingItem = action.value as UIProduct;
      const snapshotFound = snapshot.find(
        e => e.product.id === incomingItem.product.id,
      );
      const foundItemIndex = items.findIndex(e => e.id === incomingItem.id);

      if (foundItemIndex !== -1) {
        let product = incomingItem.product;

        if (product.id === 'n/a') {
          product = await this.productRepository.findOrCreateById(
            incomingItem.product,
          );
        }

        const updatedItem = await this.shoppingListRepository.addOrUpdate(
          listId,
          {
            id: incomingItem.shoppingListId,
            checked: incomingItem.checked,
            product: product,
            quantity: incomingItem.quantity ?? 0,
            unit: incomingItem.selectedUnit ?? '',
            category: incomingItem.selectedCategory,
            // cloudId: incomingItem. TODO:
            status: this.shallowEqual(incomingItem, snapshotFound)
              ? 'active'
              : 'draft',
          },
        );

        const updatedItems = [...items];

        updatedItems[foundItemIndex] = {
          ...incomingItem,
          id: getUUID(),
          shoppingListId: updatedItem.id,
        } as UIProduct;
        return updatedItems;
      } else {
        return items;
      }
    } catch (error) {
      throw error;
    }
  }

  async addSelection(listId: string): Promise<void> {
    try {
      const shoppingListItems = await this.shoppingListRepository.getByStoreId(
        listId,
        ['draft'],
      );

      for (const item of shoppingListItems) {
        if (item.quantity === 0) {
          // if (user && item.cloudId) {
          //   //TODO: I have to do this on the shoppinglist screen
          //   await this.awsApi.deleteItem(item);
          // }
          await this.shoppingListRepository.markAsDeleted(item);
        } else {
          // let updatedCloudId: string | undefined;
          // if (user && listCloudId) {
          //   //TODO: I have to do this on the shoppinglist screen
          //   const {cloudId} = await this.awsApi.saveItemsByListId(
          //     item,
          //     listCloudId,
          //   );
          //   updatedCloudId = cloudId;
          // }
          await this.shoppingListRepository.addOrUpdate(listId, {
            ...item,
            status: 'active',
            checked: false,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteDraftItemsByList(
    listId: string,
    snapshot: ShoppingListItem[],
  ): Promise<void> {
    try {
      const shoppingListItems = await this.shoppingListRepository.getByStoreId(
        listId,
        ['draft'],
      );

      for (const item of shoppingListItems) {
        const snapshotFound = snapshot.find(
          e => e.product.id === item.product.id,
        );
        if (snapshotFound) {
          await this.shoppingListRepository.addOrUpdate(listId, {
            ...snapshotFound,
            status: 'active',
          });
        } else {
          await this.shoppingListRepository.destroy(item.id);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private shallowEqual(
    uiProduct: UIProduct | undefined,
    shoppingListItem: ShoppingListItem | undefined,
  ): boolean {
    return (
      uiProduct !== undefined &&
      shoppingListItem !== undefined &&
      uiProduct.product.id === shoppingListItem.product.id &&
      uiProduct.quantity === shoppingListItem.quantity &&
      uiProduct.selectedCategory?.id === shoppingListItem.category?.id &&
      uiProduct.selectedUnit === shoppingListItem.unit &&
      uiProduct.shoppingListId === shoppingListItem.id
    );
  }
}
