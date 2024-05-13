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
    AddOrUpdateBottomSheet: {
      add: 'Add',
      update: 'Update',
      unitCP: 'UNIT',
      quantity: 'Quantity',
      unit: 'Unit',
      addTextInput: 'What would you like to add?',
    },
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
    AddOrUpdateBottomSheet: {
      createList: 'Create list',
      newList: 'New List',
      renameList: 'Rename list',
      create: 'CREATE',
      update: 'UPDATE',
      suggestions: 'Suggestions',
    },
    ItemMenuBottomSheet: {
      manageList: 'Manage list',
      rename: 'Rename',
      copy: 'Copy',
      delete: 'Delete',
    },
  },
};
export default en;
export type Translations = typeof en;
