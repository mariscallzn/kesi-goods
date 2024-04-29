import {Database} from '@nozbe/watermelondb';
import {Product} from './types';
import {DAOProducts} from '../database/models';
import {Tables} from '../database/schema';

export interface ProductRepository {
  findOrCreate(product: Product): Promise<Product>;
}

export class DatabaseProductRepository implements ProductRepository {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async findOrCreate(product: Product): Promise<Product> {
    try {
      const daoProduct = await this.findProductById(product.id);
      if (daoProduct) {
        return daoProduct;
      } else {
        return await this.save(product.name);
      }
    } catch (error) {
      throw error;
    }
  }

  private async findProductById(id: string): Promise<DAOProducts | undefined> {
    try {
      const daoProduct = await this.database
        .get<DAOProducts>(Tables.products)
        .find(id);
      return daoProduct;
    } catch (error) {
      return;
    }
  }

  private async save(name: string): Promise<Product> {
    try {
      return await this.database.write(async () => {
        return await this.database
          .get<DAOProducts>(Tables.products)
          .create(dao => {
            dao.name = name;
          });
      });
    } catch (error) {
      throw error;
    }
  }
}
