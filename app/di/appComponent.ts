import {Database} from '@nozbe/watermelondb';
import {
  DatabaseStoresRepository,
  StoresRepository,
} from '../screens/stores/model/storesRepository';
import database from '../database/database';

export interface AppComponent {
  storesRepository(): StoresRepository;
}

class AppModule {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  private providesDatabase(): Database {
    return this.database;
  }

  private providesStoresRepository(database: Database): StoresRepository {
    return new DatabaseStoresRepository(database);
  }

  getStoresRepository(): StoresRepository {
    return this.providesStoresRepository(this.providesDatabase());
  }
}

class AppComponentProd implements AppComponent {
  private readonly appModule: AppModule;

  constructor(appModule: AppModule) {
    this.appModule = appModule;
  }

  storesRepository(): StoresRepository {
    return this.appModule.getStoresRepository();
  }
}

export const appComponent: AppComponent = new AppComponentProd(
  new AppModule(database),
);
