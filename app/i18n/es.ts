const es = {
  common: {
    ok: 'OK!',
    cancel: 'Cancelar',
    back: 'Atrás',
    logOut: 'Cerrar sesión',
    add: 'Agregar',
    done: 'Listo',
    undo: 'Deshacer',
    delete: 'Borrar',
    edit: 'Editar',
    copy: 'Copiar',
    search: 'Buscar',
    create: 'Crear',
    linkCopied: 'El enlace ha sido copiado al portapapeles.',
  },
  Suggestions: {
    misc: {
      groceries: 'Despensa',
      shopping: 'Compras',
      weekend: 'Fin de semana',
      trip: 'Viaje',
      todo: 'Por hacer',
      reminders: 'Recordatorios',
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
  ShoppingListScreen: {
    emptyMessage: 'Tu lista de artículos esta limpia',
    UpdateBottomSheet: {
      add: 'Agregar',
      update: 'Actualizar',
      unitCP: 'UNIDAD',
      quantity: 'Cantidad',
      unit: 'Unidad',
      addTextInput: '¿Qué te gustaría añadir?',
    },
    ListMenuBottomSheet: {
      manageList: 'Gestionar lista',
      uncheckAll: 'Limpiar selección',
      deleteCheckedItems: 'Borrar elementos seleccionados',
      searchList: 'Buscar en la lista',
    },
    Snackbar: {
      allItemsUnchecked: 'Lista de compras restablecida.',
      checkedItemsRemoved: 'Se borraron los artículos marcados.',
      itemRemoved: 'Articulo borrado.',
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
    pkg: 'paq',
  },
  StoreScreen: {
    topBarTitle: 'Hola! 👋',
    addList: 'Agregar',
    storeDeleted: 'Lista eliminada',
    emptyMessage: 'Lista vacía',
    UpdateBottomSheet: {
      createList: 'Crear lista',
      newList: 'Nueva lista',
      renameList: 'Renombrar lista',
      create: 'CREAR',
      update: 'ACTUALIZAR',
      suggestions: 'Sugerencias',
    },
    ShareBottomSheet: {
      shareList: 'Comparte esta lista',
      copyLink: 'Copy enlace',
      message: 'Mensaje',
      more: 'Otro',
      linkContent:
        'He armado una lista de compras para víveres y pensé que te podría interesar. Aquí tienes el enlace: http://kesigoods.kesicollection.com/share/{{cloudId}}\n\nSiéntete libre de agregar o cambiar lo que necesites. 😊\n\nTambién, descarga la app si aún no lo has hecho: {{storeLink}}',
    },
    ItemMenuBottomSheet: {
      manageList: 'Gestionar lista',
      rename: 'Renombrar',
      share: 'Compartir',
      copy: 'Copiar',
      delete: 'Borrar',
    },
    CopyListMenuBottomSheet: {
      copy: 'Copiar',
      wholeList: 'Lista entera',
      checkItems: 'Productos tachados',
      uncheckedItems: 'Productos pendientes',
    },
  },
};

export default es;
