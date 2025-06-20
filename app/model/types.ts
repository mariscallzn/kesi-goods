import {Status} from '../database/models';

export type Store = {
  id: string;
  name: string;
  cloudId?: string;
  checkedItems?: number;
  totalItems?: number;
};

export type ShoppingListItem = {
  id: string;
  product: Product;
  category?: Category;
  quantity: number;
  unit: string;
  checked: boolean;
  status?: Status;
  cloudId?: string;
};

export type Product = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  color: string;
};

export type MeasurementSystem = 'imperial' | 'metric';

export type KUser = {
  email: string;
};

export type StoreUser = Store & {
  user: KUser | undefined;
};
