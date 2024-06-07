import {MD3DarkTheme, MD3LightTheme, useTheme} from 'react-native-paper';
import {AppTheme, dark, light} from './types';

const KesiLightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: light,
};

const KesiDarkTheme: AppTheme = {
  ...MD3DarkTheme,
  roundness: 16,
  colors: dark,
};

export const useAppTheme = () => useTheme<AppTheme>();

export {KesiDarkTheme, KesiLightTheme};
