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

export function logger<T>(
  obj: T,
  preFix?: string,
  excludeKeys?: (keyof T)[],
): void {
  const filteredObj = excludeKeys
    ? Object.fromEntries(
        //@ts-ignore
        Object.entries(obj).filter(([key]) => !excludeKeys!.includes(key)),
      )
    : obj;

  console.log(preFix ? `${preFix} ` : '', JSON.stringify(filteredObj, null, 2));
}
