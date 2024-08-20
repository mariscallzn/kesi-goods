import {KUser, ShoppingListItem, Store} from '@/model/types';
import {type Schema} from 'amplify/data/resource';
import {generateClient} from 'aws-amplify/data';
import {ListWithItems, personListsSet} from './types';

export interface StoreApi {
  backupList(
    store: Store,
    items: ShoppingListItem[],
    user: KUser,
  ): Promise<Store>;

  fetchListByUser(user: KUser): Promise<ListWithItems[]>;
}

export class AWSStoreApi implements StoreApi {
  private readonly client = generateClient<Schema>();

  async backupList(
    store: Store,
    items: ShoppingListItem[],
    user: KUser,
  ): Promise<Store> {
    try {
      console.log('backup Here 1');
      const {errors, data: newList} = await this.client.models.List.create({
        name: store.name,
      });
      console.log('backup Here 2 ' + errors);

      if (newList) {
        console.log('backup Here 3');
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
        console.log('backup Here 4');

        let personResponse = await this.client.models.Person.get({
          email: user.email,
        });

        console.log('personResponse: ' + JSON.stringify(personResponse));

        if (personResponse.data === null) {
          console.log('backup Here 5.1');
          personResponse = await this.client.models.Person.create({
            email: user.email,
          });
        }
        console.log('backup Here 6');

        if (personResponse.data !== null) {
          console.log('backup Here 6.1');
          await this.client.models.PersonList.create({
            listId: newList.id,
            email: personResponse.data.email,
          });
        }
        console.log('backup Here 7');
        return {...store, cloudId: newList.id};
      }
      //We return the original store to no block the user for using the app
      console.log('backup Here DAM!');
      return store;
    } catch (error) {
      //We return the original store to no block the user for using the app
      return store;
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
      console.log('cloud data' + JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      throw error;
    }
  }
}
