import React from 'react';
import {Text} from 'react-native';

export interface Action {
  triggeredBy: string;
  extras?: {[key: string]: unknown};
}

export interface UIModelProps {
  id: string;
  type: string;
  action?: (action: Action) => void;
}

export const multiViewRenderer = <T extends UIModelProps>(
  subscribedViews: Map<string, React.FC<T>>,
  uiModel: T,
): React.JSX.Element => {
  const CustomView = subscribedViews.get(uiModel.type);
  if (!CustomView) {
    return __DEV__ ? (
      <Text>The {uiModel.type} is not registered in subscribedViews</Text>
    ) : (
      <></>
    );
  }
  return <CustomView {...uiModel} />;
};
