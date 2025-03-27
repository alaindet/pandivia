export function cssClassesList(cssClasses: (string | null)[]): string {
  const result = cssClasses.filter(cssClass => cssClass !== null) as string[];
  return result.join(' ');
}

export function cssClassesObject(cssClasses: { [className: string]: boolean }): string {
  let result: string[] = [];
  for (const className in cssClasses) {
    if (cssClasses[className]) {
      result.push(className);
    }
  }
  return result.join(' ');
}
