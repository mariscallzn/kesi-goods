import {ShoppingStackParamList} from './ShoppingNavigator';

export type Route = keyof ShoppingStackParamList;

export interface NavigationMetadata {
  route: Route;
}
