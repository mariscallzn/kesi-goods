export type UnknownMetadata<T = unknown> = {type: string; value: T};
export type PredicateFunction<T> = (item: T) => boolean;
export type ReplacePair<T> = {predicate: PredicateFunction<T>; newItem: T};
