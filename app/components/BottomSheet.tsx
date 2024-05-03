import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  PanResponder,
  PanResponderInstance,
  Pressable,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

//#region Types
export type BottomSheetProps = ViewProps & {
  dismissed?: () => void;
  isVisible: boolean;
  maxHeight: MaxHeight;
};

export type MaxHeight = 25 | 50 | 85;
//#endregion

//#region Component
const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  dismissed,
  isVisible,
  maxHeight,
}) => {
  const _sheetHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(_sheetHeight)).current;
  const {height} = useWindowDimensions();
  const {colors} = useTheme();

  const [panResponder, setPanResponder] = useState<PanResponderInstance | null>(
    null,
  );
  const [sheetHeight, setSheetHeight] = useState(0);
  const [_isVisible, _setIsVisible] = useState(false);

  const expandContent = useCallback(() => {
    _setIsVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const collapseContent = useCallback(() => {
    Animated.spring(translateY, {
      toValue: sheetHeight,
      useNativeDriver: true,
      restSpeedThreshold: 100,
      restDisplacementThreshold: 100,
    }).start(() => {
      _setIsVisible(false);
      dismissed?.();
      //Reset values to allow the bottom sheet to start over fresh
      translateY.setValue(_sheetHeight);
      setSheetHeight(0);
    });
  }, [dismissed, sheetHeight, translateY, _sheetHeight]);

  useEffect(() => {
    setPanResponder(
      PanResponder.create({
        onStartShouldSetPanResponder: () => sheetHeight <= height * 0.5,
        onStartShouldSetPanResponderCapture: (_, g) =>
          sheetHeight === 0 && g.dy === 0,
        //Only response to vertical gestures
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        //Update translateY value based on the gesture position
        onPanResponderMove: (_, gestureState) =>
          translateY.setValue(gestureState.dy >= 0 ? gestureState.dy : 0),
        onPanResponderRelease: (_, gestureState) => {
          //If the gesture ends above the threshold, the bottom sheet is dismissed
          if (gestureState.dy > sheetHeight * 0.4) {
            collapseContent();
          } else {
            //Bounce it back to the top
            expandContent();
          }
        },
      }),
    );
  }, [collapseContent, expandContent, translateY, sheetHeight, height]);

  useEffect(() => {
    if (isVisible) {
      expandContent();
    } else {
      collapseContent();
    }
  }, [isVisible, translateY, expandContent, collapseContent]);

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={_isVisible}
      animationType="fade">
      <KeyboardAvoidingView style={$container} behavior="height">
        <TouchableWithoutFeedback onPress={() => collapseContent()}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={[$shadowContainer, {backgroundColor: '#00000080'}]}
          />
        </TouchableWithoutFeedback>
        <View style={$sheetContainer}>
          <Animated.View
            {...panResponder?.panHandlers}
            style={[
              $sheet,
              {
                backgroundColor: colors.surface,
                transform: [{translateY: translateY}],
              },
            ]}
            onLayout={(e: LayoutChangeEvent) => {
              setSheetHeight(e.nativeEvent.layout.height);
            }}>
            <View
              style={[
                $childrenContainer,
                {
                  maxHeight: height * (maxHeight / 100),
                },
              ]}>
              <Pressable style={$dragIndicatorContainer}>
                <View
                  style={[$dragIndicator, {backgroundColor: colors.onSurface}]}
                />
              </Pressable>
              {children}
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomSheet;
//#endregion

//#region Styles
const $container: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  start: 0,
  end: 0,
  top: 0,
};

const $shadowContainer: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  start: 0,
  end: 0,
  top: 0,
};

const $sheetContainer: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  start: 0,
  end: 0,
};

const $sheet: ViewStyle = {
  justifyContent: 'flex-end',
  backgroundColor: 'white',
  borderTopStartRadius: 10,
  borderTopEndRadius: 10,
};

const $dragIndicatorContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  paddingVertical: 12,
};

const $dragIndicator: ViewStyle = {
  width: 32,
  height: 4,
  borderRadius: 8,
};

const $childrenContainer: ViewStyle = {
  paddingBottom: 16,
};
//#endregion
