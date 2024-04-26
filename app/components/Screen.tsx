import React, {FC} from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {
  ExtendedEdge,
  useSafeAreaInsetsStyle,
} from '../utils/useSafeAreaInsetsStyle';
import {StatusBar, StatusBarProps} from 'expo-status-bar';

//#region Constants
const isIos = Platform.OS === 'ios';
//#endregion

//#region Types
type ScreenProps = {
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[];
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  statusBarProps?: StatusBarProps;
  /**
   * By how much should we offset the keyboard? Defaults to 0.
   */
  keyboardOffset?: number;
  /**
   * Pass any additional props directly to the KeyboardAvoidingView component.
   */
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
};
//#endregion

export const Screen: FC<ScreenProps> = ({
  children,
  safeAreaEdges,
  statusBarProps,
  keyboardOffset = 0,
  keyboardAvoidingViewProps,
}) => {
  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);
  const colorScheme = useColorScheme();
  return (
    <View style={[$containerStyle, $containerInsets]}>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        {...statusBarProps}
      />
      <KeyboardAvoidingView
        behavior={isIos ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
        {...keyboardAvoidingViewProps}
        style={[$keyboardAvoidingViewStyle, keyboardAvoidingViewProps?.style]}>
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

//#region Typed Styles
const $containerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%',
};
const $keyboardAvoidingViewStyle: ViewStyle = {
  flex: 1,
};
//#endregion
