import {Database, Q} from '@nozbe/watermelondb';
import {DAOProducts} from '../database/models';
import {Columns, Tables} from '../database/schema';
import {SettingsRepository} from './settingsRepository';
import {Product} from './types';

export interface ProductRepository {
  findByNameOrFetch(name?: string): Promise<Product[]>;
  findOrCreate(product: Product): Promise<Product>;
}

export class DatabaseProductRepository implements ProductRepository {
  private readonly database: Database;
  private readonly productsEN: string[];
  private readonly productsES: string[];
  private readonly settings: SettingsRepository;

  constructor(
    database: Database,
    settings: SettingsRepository,
    productsEN: string[],
    productsES: string[],
  ) {
    this.database = database;
    this.settings = settings;
    this.productsEN = productsEN;
    this.productsES = productsES;
  }

  async findByNameOrFetch(name?: string): Promise<Product[]> {
    try {
      const _name = name?.trim();
      let result: Product[] = [];
      if (_name) {
        const exactMatch = await this.database
          .get<DAOProducts>(Tables.products)
          .query(Q.where(Columns.products.name, Q.eq(_name)))
          .fetch();

        if (exactMatch.length > 0) {
          return [{id: exactMatch[0].id, name: exactMatch[0].name}];
        }

        result = await this.database
          .get<DAOProducts>(Tables.products)
          .query(
            Q.where(
              Columns.products.name,
              Q.like(`${Q.sanitizeLikeString(_name)}%`),
            ),
          )
          .fetch();
      } else {
        result = (
          await this.database.get<DAOProducts>(Tables.products).query().fetch()
        ).map(c => ({id: c.id, name: c.name}));
        if (result.length === 0) {
          result = await this.populateTable();
        }
      }
      return result.map(e => ({id: e.id, name: e.name}));
    } catch (error) {
      throw error;
    }
  }

  async findOrCreate(product: Product): Promise<Product> {
    try {
      const daoProduct = await this.findProductById(product.id);
      if (daoProduct) {
        return {id: daoProduct.id, name: daoProduct.name};
      } else {
        return await this.save(product.name);
      }
    } catch (error) {
      throw error;
    }
  }

  private async findProductById(id: string): Promise<Product | undefined> {
    try {
      const daoProduct = await this.database
        .get<DAOProducts>(Tables.products)
        .find(id);
      return {id: daoProduct.id, name: daoProduct.name};
    } catch (error) {
      return;
    }
  }

  private async save(name: string): Promise<Product> {
    try {
      const daoProduct = await this.database.write(async () => {
        return await this.database
          .get<DAOProducts>(Tables.products)
          .create(dao => {
            dao.name = name;
          });
      });
      return {id: daoProduct.id, name: daoProduct.name};
    } catch (error) {
      throw error;
    }
  }

  private async populateTable(): Promise<Product[]> {
    try {
      let products: string[] = [];
      //TODO:
      if (this.settings.getLocale() === 'en-US') {
        products = this.productsEN;
      } else {
        products = this.productsES;
      }
      for (const product of products) {
        try {
          await this.database.write(async () => {
            return await this.database
              .get<DAOProducts>(Tables.products)
              .create(dao => {
                dao.name = product;
              });
          });
        } catch (error) {
          throw error;
        }
      }
      return this.findByNameOrFetch();
    } catch (error) {
      throw error;
    }
  }
}
