import {translate} from '../../i18n/translate';
import {Suggestions} from './types';

export interface AddStoreService {
  fetchSuggestions(): Suggestions;
}

export class AddStoreServiceImpl implements AddStoreService {
  fetchSuggestions(): Suggestions {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-US', {weekday: 'long'});
    const formattedDate = today.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    return {
      misc: [
        translate('Suggestions.misc.groceries'),
        weekday,
        translate('Suggestions.misc.shopping'),
        formattedDate,
        translate('Suggestions.misc.todo'),
        translate('Suggestions.misc.weekend'),
        translate('Suggestions.misc.trip'),
        translate('Suggestions.misc.reminders'),
      ],
      stores: [
        translate('Suggestions.stores.walmart'),
        translate('Suggestions.stores.samsclub'),
        translate('Suggestions.stores.costco'),
        translate('Suggestions.stores.homedepot'),
        translate('Suggestions.stores.officeDepot'),
        translate('Suggestions.stores.seven11'),
      ],
    };
  }
}
