import React from 'react';
import {Text} from 'react-native';
import {ComponentMap, UIModel} from './types';

export const getComponent = <K, T extends UIModel<K>>(
  uiModel: T,
  componentMap: ComponentMap<K>,
): React.JSX.Element => {
  const Component = componentMap[uiModel.type];
  return !Component ? (
    <Text>{uiModel.type.toString()} is not registered</Text>
  ) : (
    //@ts-ignore safe call
    <Component key={uiModel.id} {...uiModel} />
  );
};
