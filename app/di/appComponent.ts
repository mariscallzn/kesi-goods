import {Database} from '@nozbe/watermelondb';
import {
  DatabaseStoresRepository,
  StoresRepository,
} from '../model/storesRepository';
import database from '../database/database';
import {
  StoresService,
  StoresServiceImpl,
} from '../screens/stores/storesService';
import {
  ShoppingListService,
  ShoppingListServiceImpl,
} from '../screens/shopping/shoppingListService';
import {
  DatabaseShoppingListRepository,
  ShoppingListRepository,
} from '../model/shoppingListRepository';
import {
  DatabaseProductRepository,
  ProductRepository,
} from '../model/productRepository';
import {
  CategoryRepository,
  DatabaseCategoryRepository,
} from '../model/categoryRepository';
import {
  SettingsRepository,
  SettingsRepositoryImpl,
} from '../model/settingsRepository';
import {
  ProductService,
  ProductServiceImpl,
} from '../screens/products/productService';
import {
  AddStoreService,
  AddStoreServiceImpl,
} from '../screens/add-store/addStoreService';
import {AWSStoreApi, StoreApi} from '@/api/storesApi';
import {
  GlobalSettingsService,
  GlobalSettingsServiceImpl,
} from '@/screens/global-settings/globalSettingsService';
import {AuthRepository, AuthRepositoryImpl} from '@/model/authRepository';

export interface AppComponent {
  storesService(): StoresService;
  shoppingListService(): ShoppingListService;
  productService(): ProductService;
  addStoreService(): AddStoreService;
  globalSettingsService(): GlobalSettingsService;
}

class AppModule {
  private readonly database: Database;
  private readonly productsEN: string[];
  private readonly productsES: string[];

  constructor(_database: Database, productsEN: string[], productsES: string[]) {
    this.database = _database;
    this.productsEN = productsEN;
    this.productsES = productsES;
  }

  private providesDatabase(): Database {
    return this.database;
  }

  private providesProductsEN(): string[] {
    return this.productsEN;
  }

  private providesProductsES(): string[] {
    return this.productsES;
  }

  private providesStoresRepository(_database: Database): StoresRepository {
    return new DatabaseStoresRepository(_database);
  }

  private providesShoppingListRepository(
    _database: Database,
  ): ShoppingListRepository {
    return new DatabaseShoppingListRepository(_database);
  }

  private providesProductRepository(
    _database: Database,
    settingsRepository: SettingsRepository,
    productsEN: string[],
    productsES: string[],
  ): ProductRepository {
    return new DatabaseProductRepository(
      _database,
      settingsRepository,
      productsEN,
      productsES,
    );
  }

  private providesCategoryRepository(_database: Database): CategoryRepository {
    return new DatabaseCategoryRepository(_database);
  }

  private providesSettingsRepository(/*AsyncStorageUtils or some*/): SettingsRepository {
    return new SettingsRepositoryImpl();
  }

  private providesStoreApi(): StoreApi {
    return new AWSStoreApi();
  }

  private providesAuthRepository(): AuthRepository {
    return new AuthRepositoryImpl();
  }

  getStoresService(): StoresService {
    return new StoresServiceImpl(
      this.providesStoresRepository(this.providesDatabase()),
      this.providesShoppingListRepository(this.providesDatabase()),
      this.providesAuthRepository(),
      this.providesProductRepository(
        this.providesDatabase(),
        this.providesSettingsRepository(),
        this.providesProductsEN(),
        this.providesProductsES(),
      ),
      this.providesCategoryRepository(this.providesDatabase()),
      this.providesStoreApi(),
    );
  }

  getShoppingListService(): ShoppingListService {
    return new ShoppingListServiceImpl(
      this.providesShoppingListRepository(this.providesDatabase()),
      this.providesProductRepository(
        this.providesDatabase(),
        this.providesSettingsRepository(),
        this.providesProductsEN(),
        this.providesProductsES(),
      ),
      this.providesCategoryRepository(this.providesDatabase()),
      this.providesStoresRepository(this.providesDatabase()),
      this.providesStoreApi(),
    );
  }

  getProductService(): ProductService {
    return new ProductServiceImpl(
      this.providesShoppingListRepository(this.providesDatabase()),
      this.providesProductRepository(
        this.providesDatabase(),
        this.providesSettingsRepository(),
        this.providesProductsEN(),
        this.providesProductsES(),
      ),
      this.providesCategoryRepository(this.providesDatabase()),
      this.providesStoresRepository(this.providesDatabase()),
    );
  }

  getAddStoreService(): AddStoreService {
    return new AddStoreServiceImpl();
  }

  getGlobalSettingsService(): GlobalSettingsService {
    return new GlobalSettingsServiceImpl(
      this.providesAuthRepository(),
      this.providesStoresRepository(this.providesDatabase()),
      this.providesShoppingListRepository(this.providesDatabase()),
    );
  }
}

class AppComponentProd implements AppComponent {
  private readonly appModule: AppModule;

  constructor(appModule: AppModule) {
    this.appModule = appModule;
  }

  storesService(): StoresService {
    return this.appModule.getStoresService();
  }

  shoppingListService(): ShoppingListService {
    return this.appModule.getShoppingListService();
  }

  productService(): ProductService {
    return this.appModule.getProductService();
  }

  addStoreService(): AddStoreService {
    return this.appModule.getAddStoreService();
  }

  globalSettingsService(): GlobalSettingsService {
    return this.appModule.getGlobalSettingsService();
  }
}

export const appComponent: AppComponent = new AppComponentProd(
  new AppModule(
    database,
    require('../model/products-en.json'),
    require('../model/products-es.json'),
  ),
);
