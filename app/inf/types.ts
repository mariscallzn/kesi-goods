//These are improvements to the current multiViewRenderer but are not used in the project
export type Action<T = unknown> = {type: string; value: T};
export type ActionCallback = (action: Action) => void;
export interface UIModel<T> {
  id: string;
  type: keyof T;
  action?: ActionCallback;
}

export type ComponentMap<T> = {
  [K in keyof T]: React.FC<T[K]>;
};
