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
    ListMenuBottomSheet: {
      manageList: 'Manage list',
      uncheckAll: 'Uncheck all items',
      deleteCheckedItems: 'Delete checked items',
      searchList: 'Search on the list',
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
    storeDeleted: 'List deleted',
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
