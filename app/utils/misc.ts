import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export const getUUID = () => uuidv4();

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const darkenColor = (color: string, amount: number): string => {
  let usePound = false;

  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }

  let r = parseInt(color.slice(0, 2), 16) - amount;
  let g = parseInt(color.slice(2, 4), 16) - amount;
  let b = parseInt(color.slice(4, 6), 16) - amount;

  r = r < 0 ? 0 : r;
  g = g < 0 ? 0 : g;
  b = b < 0 ? 0 : b;

  const newColor = `${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return usePound ? `#${newColor}` : newColor;
};

export const safeDivision = (
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
