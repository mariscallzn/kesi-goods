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

export interface AppComponent {
  storesService(): StoresService;
  shoppingListService(): ShoppingListService;
}

class AppModule {
  private readonly database: Database;

  constructor(_database: Database) {
    this.database = _database;
  }

  private providesDatabase(): Database {
    return this.database;
  }

  private providesStoresRepository(_database: Database): StoresRepository {
    return new DatabaseStoresRepository(_database);
  }

  private providesShoppingListRepository(
    _database: Database,
  ): ShoppingListRepository {
    return new DatabaseShoppingListRepository(_database);
  }

  private providesProductRepository(_database: Database): ProductRepository {
    return new DatabaseProductRepository(_database);
  }

  private providesCategoryRepository(_database: Database): CategoryRepository {
    return new DatabaseCategoryRepository(_database);
  }

  getStoresService(): StoresService {
    return new StoresServiceImpl(
      this.providesStoresRepository(this.providesDatabase()),
    );
  }

  getShoppingListService(): ShoppingListService {
    return new ShoppingListServiceImpl(
      this.providesShoppingListRepository(this.providesDatabase()),
      this.providesProductRepository(this.providesDatabase()),
      this.providesCategoryRepository(this.providesDatabase()),
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
  new AppModule(database),
);
