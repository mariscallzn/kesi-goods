import {MeasurementSystem} from './types';

export interface SettingsRepository {
  getLocale(): string;
  getMeasurementSystem(): MeasurementSystem;
}

export class SettingsRepositoryImpl implements SettingsRepository {
  getLocale(): string {
    return 'en-US'; //TODO Use whatever lib is needed here
  }
  getMeasurementSystem(): MeasurementSystem {
    return 'imperial';
  }
}
