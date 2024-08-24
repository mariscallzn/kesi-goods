import {KUser, ShoppingListItem, Store} from '@/model/types';
import {type Schema} from 'amplify/data/resource';
import {generateClient} from 'aws-amplify/data';
import {ListWithItems, personListsSet} from './types';

export interface AWSApi {
  backupList(
    store: Store,
    items: ShoppingListItem[],
    user: KUser,
  ): Promise<Store>;
  updateList(store: Store): Promise<void>;
  fetchListByUser(user: KUser): Promise<ListWithItems[]>;
  deleteLists(stores: Store[]): Promise<void>;
  saveItemsByListId(
    item: ShoppingListItem,
    listId: string,
  ): Promise<ShoppingListItem>;
  deleteItem(item: ShoppingListItem): Promise<void>;
}

export class AWSApiImpl implements AWSApi {
  private readonly client = generateClient<Schema>();

  async backupList(
    store: Store,
    items: ShoppingListItem[],
    user: KUser,
  ): Promise<Store> {
    try {
      const {data: newList} = await this.client.models.List.create({
        name: store.name,
      });

      if (newList) {
        for (const item of items) {
          await this.client.models.Item.create({
            listId: newList.id,
            checked: item.checked,
            name: item.product.name,
            category: item.category?.color,
            quantity: item.quantity,
            unit: item.unit,
          });
        }

        let personResponse = await this.client.models.Person.get({
          email: user.email,
        });

        if (personResponse.data === null) {
          personResponse = await this.client.models.Person.create({
            email: user.email,
          });
        }

        if (personResponse.data !== null) {
          await this.client.models.PersonList.create({
            listId: newList.id,
            email: personResponse.data.email,
          });
        }

        return {...store, cloudId: newList.id};
      }
      //We return the original store to no block the user for using the app
      return store;
    } catch (error) {
      //We return the original store to no block the user for using the app
      return store;
    }
  }

  async updateList(store: Store): Promise<void> {
    try {
      if (store.cloudId) {
        await this.client.models.List.update({
          id: store.cloudId,
          name: store.name,
        });
      } else {
        throw new Error(
          'This is not a synced list, therefore we cannot attempt to delete it',
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchListByUser(user: KUser): Promise<ListWithItems[]> {
    try {
      const result: ListWithItems[] = [];
      const {data: lists} = await this.client.models.Person.get(
        {email: user.email},
        {
          selectionSet: personListsSet,
        },
      );

      for (const list of lists?.lists ?? []) {
        const {data: items} = await this.client.models.List.get(
          {
            id: list.list.id,
          },
          {selectionSet: ['items.*']},
        );
        //@ts-ignore
        result.push({...list.list, items: items?.items ?? []});
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteLists(stores: Store[]): Promise<void> {
    try {
      //First we delete the join table relationship
      for (const store of stores) {
        if (store.cloudId) {
          //Find all persons associated to that list
          const {data: joinTableIds} = await this.client.models.PersonList.list(
            {
              filter: {
                and: [
                  {
                    listId: {eq: store.cloudId},
                  },
                ],
              },
              selectionSet: ['id'],
            },
          );

          for (const id of joinTableIds) {
            //Delete relationship for all users
            await this.client.models.PersonList.delete(id);
          }

          const {data: itemIds} = await this.client.models.Item.list({
            filter: {
              listId: {
                eq: store.cloudId,
              },
            },
            selectionSet: ['id'],
          });

          //Delete all items attach to the list
          for (const itemId of itemIds) {
            await this.client.models.Item.delete(itemId);
          }

          //Finally the list is deleted
          await this.client.models.List.delete({id: store.cloudId});
        } else {
          throw new Error(
            'This is not a synced list, therefore we cannot attempt to delete it',
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async saveItemsByListId(
    item: ShoppingListItem,
    listId: string,
  ): Promise<ShoppingListItem> {
    try {
      let cloudId: string | undefined;
      if (item.cloudId) {
        const {data: updatedItem} = await this.client.models.Item.update({
          id: item.cloudId,
          listId: listId,
          name: item.product.name,
          checked: item.checked,
          category: item.category?.color,
          quantity: item.quantity,
          unit: item.unit,
        });
        cloudId = updatedItem?.id;
      } else {
        const {data: createdItem} = await this.client.models.Item.create({
          listId: listId,
          name: item.product.name,
          checked: item.checked,
          category: item.category?.color,
          quantity: item.quantity,
          unit: item.unit,
        });
        cloudId = createdItem?.id;
      }
      return {...item, cloudId: cloudId};
    } catch (error) {
      throw error;
    }
  }

  async deleteItem(item: ShoppingListItem): Promise<void> {
    try {
      if (item.cloudId) {
        await this.client.models.Item.delete({id: item.cloudId});
      } else {
        throw new Error(
          'This is not a synced list, therefore we cannot attempt to delete it',
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
