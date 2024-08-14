import {RootStackParamList} from './RootNavigator';

export type Route = keyof RootStackParamList;

export interface NavigationMetadata {
  route: Route;
}
