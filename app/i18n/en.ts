const en = {
  common: {
    ok: 'OK!',
    cancel: 'Cancel',
    back: 'Back',
    logOut: 'Log Out',
    add: 'Add',
    done: 'Done',
    undo: 'Undo',
    delete: 'Delete',
    edit: 'Edit',
    copy: 'Copy',
    search: 'Search',
    create: 'Create',
  },
  ShoppingListScreen: {
    UpdateBottomSheet: {
      add: 'Add',
      update: 'Update',
      unitCP: 'UNIT',
      quantity: 'Quantity',
      unit: 'Unit',
      addTextInput: 'What would you like to add?',
    },
    ListMenuBottomSheet: {
      manageList: 'Manage list',
      uncheckAll: 'Uncheck all items',
      deleteCheckedItems: 'Delete checked items',
      searchList: 'Search on the list',
    },
    Snackbar: {
      allItemsUnchecked: 'All items unchecked.',
      checkedItemsRemoved: 'Checked items removed.',
      itemRemoved: 'Item removed.',
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
  Suggestions: {
    misc: {
      groceries: 'Groceries',
      shopping: 'Shopping',
      weekend: 'Weekend',
      trip: 'Trip',
      todo: 'To-do',
      reminders: 'Reminders',
    },
    stores: {
      walmart: 'Walmart',
      samsclub: "Sam's Club",
      costco: 'Costco',
      seven11: '7/11',
      homedepot: 'Home depot',
      officeDepot: 'Office depot',
    },
  },
  StoreScreen: {
    topBarTitle: 'Hello! 👋',
    addList: 'Add',
    storeDeleted: 'List deleted',
    UpdateBottomSheet: {
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
    CopyListMenuBottomSheet: {
      copy: 'Copy',
      wholeList: 'Whole list',
      checkItems: 'Checked items',
      uncheckedItems: 'Unchecked items',
    },
  },
};
export default en;
export type Translations = typeof en;
