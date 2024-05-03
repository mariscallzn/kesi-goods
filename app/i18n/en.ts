const en = {
  common: {
    ok: 'OK!',
    cancel: 'Cancel',
    back: 'Back',
    logOut: 'Log Out',
    add: 'Add',
    done: 'Done',
  },
  ShoppingListScreen: {
    productName: 'Product name',
    quantity: 'Quantity',
    unit: 'Unit',
  },
  Units: {
    Imperial: {
      lb: 'lb',
      gal: 'gal',
      oz: 'oz',
    },
    Metric: {
      kg: 'kg',
      l: 'l',
      ml: 'ml',
    },
    pkg: 'pkg',
  },
  StoreScreen: {
    topBarTitle: 'Hello! 👋',
    addList: 'Add',
    CreateBottomSheet: {
      newList: 'New list',
      create: 'Create',
    },
  },
};
export default en;
export type Translations = typeof en;
