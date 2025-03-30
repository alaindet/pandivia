import { KeyboardKey } from '../../types';
import { KeydownBinder, KeydownBinding, KeydownHandler } from './on-keydown';

export function createKeyBinding(
  on: KeyboardKey[] | KeydownBinder,
  handler: KeydownHandler
): KeydownBinding {
  return { on, handler };
}
