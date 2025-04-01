export async function copyToClipboard(content: string): Promise<void> {

  if (!navigator.clipboard) {
    throw new Error('Cannot copy to clipboard!');
  }

  return navigator.clipboard.writeText(content);
}
