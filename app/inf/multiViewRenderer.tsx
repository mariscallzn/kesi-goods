import React from 'react';
import {Text} from 'react-native';
import {UnknownMetadata} from '../utils/types';

export type ActionCallback<T = unknown> = (action: Action<T>) => void;

export interface Action<T = unknown> {
  metadata: UnknownMetadata<T>;
}

export interface UIModelProps {
  id: string;
  type: string;
  action?: ActionCallback;
}

export type UIModelType<T extends UIModelProps> = {[key: string]: React.FC<T>};

export const multiViewRenderer = <T extends UIModelProps>(
  subscribedViews: UIModelType<T>,
  uiModel: T,
): React.JSX.Element => {
  const CustomView = subscribedViews[uiModel.type];
  if (!CustomView) {
    return __DEV__ ? (
      <Text>The {uiModel.type} is not registered in subscribedViews</Text>
    ) : (
      <></>
    );
  }
  return <CustomView {...uiModel} />;
};
