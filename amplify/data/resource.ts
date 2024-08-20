import {type ClientSchema, a, defineData} from '@aws-amplify/backend';

const schema = a.schema({
  PersonList: a
    .model({
      email: a.email().required(),
      listId: a.id().required(),
      person: a.belongsTo('Person', 'email'),
      list: a.belongsTo('List', 'listId'),
    })
    .authorization(allow => [allow.authenticated()]),
  Item: a
    .model({
      name: a.string().required(),
      checked: a.boolean().required(),
      category: a.string(),
      quantity: a.integer(),
      unit: a.string(),
      listId: a.id(),
      list: a.belongsTo('List', 'listId'),
    })
    .authorization(allow => [allow.authenticated()]),
  List: a
    .model({
      name: a.string(),
      items: a.hasMany('Item', 'listId'),
      persons: a.hasMany('PersonList', 'listId'),
    })
    .authorization(allow => [allow.authenticated()]),
  Person: a
    .model({
      email: a.email().required(),
      lists: a.hasMany('PersonList', 'email'),
    })
    .identifier(['email'])
    .authorization(allow => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
