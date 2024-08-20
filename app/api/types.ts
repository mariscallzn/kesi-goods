import {Schema} from 'amplify/data/resource';
import type {SelectionSet} from 'aws-amplify/data';

export const personListsSet = ['lists.list.*'] as const;
export type Lists = SelectionSet<
  Schema['Person']['type'],
  typeof personListsSet
>;

type Item = Schema['Item']['type'];
type List = Schema['List']['type'];

export type ListWithItems = List & {
  items: Item[];
};
