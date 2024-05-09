import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';

export const getUUID = () => uuidv4();

export const saveDivision = (
  divisor: number | undefined,
  dividend: number | undefined,
): number => {
  if (divisor && dividend) {
    const result = divisor / dividend;
    return isNaN(result) ? 0 : result;
  } else {
    return 0;
  }
};
