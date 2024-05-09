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

export interface AppComponent {
  storesService(): StoresService;
  shoppingListService(): ShoppingListService;
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

  getStoresService(): StoresService {
    return new StoresServiceImpl(
      this.providesStoresRepository(this.providesDatabase()),
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
}

export const appComponent: AppComponent = new AppComponentProd(
  new AppModule(
    database,
    require('../model/products-en.json'),
    require('../model/products-es.json'),
  ),
);
