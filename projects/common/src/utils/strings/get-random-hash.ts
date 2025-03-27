import { getRandomInteger } from '../numbers/get-random-integer';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export function getRandomHash(len: number): string {
  if (len <= 0) return '';
  let temp: string[] = [];

  while (temp.length < len) {
    const i = getRandomInteger(0, LETTERS.length - 1);
    temp.push(LETTERS[i]);
  }

  return temp.join('');
}
