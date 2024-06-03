import {MD3DarkTheme, MD3LightTheme, MD3Theme} from 'react-native-paper';

export type AppTheme = MD3Theme & {};

const KesiLightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: 16,
};

const KesiDarkTheme: AppTheme = {
  ...MD3DarkTheme,
  roundness: 16,
};

export {KesiDarkTheme, KesiLightTheme};
