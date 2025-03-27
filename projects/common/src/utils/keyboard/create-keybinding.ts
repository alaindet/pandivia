import { KeyboardKey } from '../../types/public-api';
import { KeydownBinder, KeydownBinding, KeydownHandler } from './on-keydown';

export function createKeyBinding(
  on: KeyboardKey[] | KeydownBinder,
  handler: KeydownHandler
): KeydownBinding {
  return { on, handler };
}
