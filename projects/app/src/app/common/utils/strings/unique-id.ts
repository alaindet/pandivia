import { getRandomHash } from './get-random-hash';

export function uniqueId(
  existingId: string | undefined,
  prefix: string = '',
  hashLength = 3,
): string {
  if (existingId) {
    return existingId;
  }

  if (prefix === '') {
    return getRandomHash(hashLength);
  }

  return `${prefix}-${getRandomHash(hashLength)}`;
}
