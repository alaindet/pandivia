import { ConfirmPromptModalInput } from '@ui/components/confirm-prompt-modal';

export const UPGRADE_APPLICATION_ACTION = 'upgrade-application';

export const UPGRADE_APPLICATION_PROMPT: ConfirmPromptModalInput = {
  action: UPGRADE_APPLICATION_ACTION,
  title: 'upgrade.promptTitle',
  message: 'upgrade.promptMessage',
};
