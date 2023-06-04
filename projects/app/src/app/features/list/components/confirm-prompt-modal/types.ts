export type ConfirmPromptModalInput = {
  action: string;
  type: 'list' | 'category' | 'item';
  value: string | null;
  title: string; // TODO: Translate
  message: string; // TODO: Translate
};

export type ConfirmPromptModalOutput = {
  action: string;
  type: 'list' | 'category' | 'item';
  value: string | null;
};