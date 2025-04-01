export function cssClassesList(cssClasses: (string | null)[]): string {
  const result = cssClasses.filter((cssClass) => cssClass !== null) as string[];
  return result.join(' ');
}
