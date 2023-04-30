export function isCloseTo(a: number, b: number, tolerance = 0.001): boolean {
  let diff = a - b;
  if (diff < 0) diff = -diff;
  return diff <= tolerance;
}
