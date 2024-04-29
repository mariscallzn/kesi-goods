import {Database} from '@nozbe/watermelondb';
import {Category} from './types';
import {DAOCategories} from '../database/models';
import {Tables} from '../database/schema';

export interface CategoryRepository {
  fetch(): Promise<Category[]>;
  findOrCreate(category: Category): Promise<Category>;
}

export class DatabaseCategoryRepository implements CategoryRepository {
  private readonly database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async fetch(): Promise<Category[]> {
    try {
      return await this.database
        .get<DAOCategories>(Tables.categories)
        .query()
        .fetch();
    } catch (error) {
      throw error;
    }
  }

  async findOrCreate(category: Category): Promise<Category> {
    try {
      const daoCategory = await this.findCategoryById(category.id);
      if (daoCategory) {
        return daoCategory;
      } else {
        return await this.save(category.color);
      }
    } catch (error) {
      throw error;
    }
  }

  private async save(color: string): Promise<Category> {
    try {
      return await this.database.write(async () => {
        return await this.database
          .get<DAOCategories>(Tables.categories)
          .create(dao => {
            dao.color = color;
          });
      });
    } catch (error) {
      throw error;
    }
  }

  private async findCategoryById(id: string): Promise<Category | undefined> {
    try {
      return await this.database.get<DAOCategories>(Tables.categories).find(id);
    } catch (error) {
      return;
    }
  }
}
